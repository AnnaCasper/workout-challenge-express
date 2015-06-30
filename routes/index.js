var express = require('express');
var router = express.Router();

var db = require('monk')(process.env.MONGO_URI_CHALLENGES);
var challengeCollection = db.get('challenge');
var userCollection = db.get('user');

// var db2 = require('monk')(process.env.MONGO_URI_USERS);

var functions = require('../public/javascripts/functions.js')
var validations = require('../public/javascripts/validations.js')

var bcrypt = require('bcryptjs');

// GET home page/login page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Workout Challenge', currentUser: req.cookies.currentUser});
});

//user login
router.post('/login', function(req, res, next){
  userCollection.findOne({ email: req.body.login_email}, function(err, data){
    var compare = bcrypt.compareSync(req.body.login_password, data.password);
    if (compare === true){
      res.cookie('currentUser', data._id);
      res.redirect('/challenges');
    };
  });
});

//GET new user page
router.get('/users/new', function(req, res, next){
  res.render('users/new', {currentUser: req.cookies.currentUser});
});

//POST new user
router.post('/users/new', function(req, res, next){
  var errors = validations.validateSignUp(
    req.body.user_name,
    req.body.email,
    req.body.password,
    req.body.confirm
    );
  if (errors.length === 0){
    var hash = bcrypt.hashSync(req.body.password, 8);
    userCollection.insert({
      user_name: req.body.user_name,
      email: req.body.email,
      password: hash,
      challenge_ids: [],
      scores: []
      });
    userCollection.findOne({email: req.body.email}, function(err, data){
      res.cookie('currentUser', data._id);
      res.redirect('/challenges');
    });
  } else {
      res.render('users/new', {
        errors: errors,
        user_name: req.body.user_name,
        email: req.body.email
        });
    };
});

// GET new challenge page
router.get('/challenges/new', function(req, res, next){
  res.render('challenges/new', {currentUser: req.cookies.currentUser});
});

// POST new challenge in database
router.post('/challenges', function(req, res, next){
  var errors = validations.validateNewChallenge(
    req.body.challenge_name,
    req.body.challenge_length,
    req.body.start_date
    );
  if(errors.length === 0){
    challengeCollection.insert({
      challenge_name: req.body.challenge_name,
      challenge_length: req.body.challenge_length,
      start_date: req.body.start_date,
      user_ids: [],
      scores: []
      });
    res.redirect('/challenges');
  } else {
    res.render('challenges/new', {
      errors: errors,
      challenge_name: req.body.challenge_name,
      challenge_length: req.body.challenge_length,
      start_date: req.body.start_date,
      });
  };
});

//GET challenges index page
router.get('/challenges', function(req, res, next){
  challengeCollection.find({}, function(err, data){
    res.render('challenges/index', {allChallenges: data, currentUser: req.cookies.currentUser});
  });
});

//GET show challenge page
router.get('/challenges/:id', function(req, res, next){
  challengeCollection.findOne({_id: req.params.id}, function(err, data){
    var userIds = functions.displayIds(data.user_ids);
    userCollection.find({ _id: {$in: userIds }}, function(err, record){
      res.render('challenges/show', {thisChallenge: data, users: record, currentUser: req.cookies.currentUser});
    });
  });
});

//POST join this challenge
router.post('/challenges/:id/join', function(req, res, next){
  userCollection.update({_id: req.cookies.currentUser},
    {$push: {
      challenge_ids: req.params.id
      }
    });
  challengeCollection.update({_id: req.params.id},
    {$push: {
      user_ids: req.cookies.currentUser
      }
    });
  res.redirect('/challenges/' + req.params.id);
});

//GET edit challenge page
router.get('/challenges/:id/edit', function(req, res, next){
  challengeCollection.findOne({_id: req.params.id}, function(err, data){
    res.render('challenges/edit', { thisChallenge: data, currentUser: req.cookies.currentUser});
  });
});

//POST edits to challenge in database
router.post('/challenges/:id/edit', function(req, res, next){
  challengeCollection.update({_id: req.params.id},
    {$set: {
      challenge_name: req.body.challenge_name,
      challenge_length: req.body.challenge_length,
      start_date: req.body.start_date,
      }
    });
  res.redirect('/challenges/' + req.params.id);
});

//POST remove challenge in database
router.post('/challenges/:id/delete', function(req, res, next){
  challengeCollection.remove({_id: req.params.id});
  res.redirect('/challenges');
});

//GET show user profile
router.get('/users/profile', function(req, res, next){
  userCollection.findOne({_id: req.cookies.currentUser}, function(err, data){
    var challengeIds = functions.displayIds(data.challenge_ids);
    challengeCollection.find({ _id: {$in: challengeIds}}, function(err, record){
      res.render('users/show', {thisUser: data, challenges: record, currentUser: req.cookies.currentUser});
    })
  });
});

//POST user logout
router.post('/logout', function(req, res, next){
  res.clearCookie('currentUser');
  res.redirect('/');
});

//GET user profile page
router.get('/users/:id/edit', function(req, res, next){
  userCollection.findOne({_id: req.params.id}, function(err, data){
    res.render('users/edit', {thisUser: data, currentUser: req.cookies.currentUser});
  });
});

//POST edits to user profile
router.post('/users/:id/edit', function(req, res, next){
  userCollection.update({_id: req.params.id},
    { $set: {
      user_name: req.body.user_name,
      email: req.body.email
      }
    });
  res.redirect('/users/profile');
});

//POST remove user in database
router.post('/users/:id/delete', function(req, res, next){
  userCollection.remove({_id: req.params.id});
  res.clearCookie('currentUser');
  res.redirect('/');
});

//GET add new score page
router.get('/challenges/:id/:day/scores', function(req, res, next){
  challengeCollection.findOne({_id: req.params.id}, function(err, record){
    userCollection.findOne({_id: req.cookies.currentUser}, function(err, data){
      res.render('challenges/scores', {
        thisUser: data,
        thisChallenge: record,
        day: req.params.day,
        currentUser: req.cookies.currentUser
      });
    });
  })
});

//POST new score to challenge database
router.post('/challenges/:id/:day/scores', function(req, res, next){
  var dailyScore = functions.dailyScore(
    req.body.healthy_meals,
    req.body.unhealthy_meals,
    req.body.workouts,
    req.body.alcohol,
    req.body.water,
    req.body.perfect
  );
  userCollection.update({_id: req.cookies.currentUser},
    {$push: {
      scores: {
        $each: [{
          challenge_id: req.params.id,
          day: req.params.day,
          healthy_meals: req.body.healthy_meals,
          unhealthy_meals: req.body.unhealthy_meals,
          workouts: req.body.workouts,
          alcohol: req.body.alcohol,
          water: req.body.water,
          perfect: req.body.perfect,
          score: dailyScore
          }]
        }
      }});
  challengeCollection.update( {_id: req.params.id},
    {$push: {
      scores: {
        $each: [{
        user_id: req.cookies.currentUser,
        day: req.params.day,
        score: dailyScore
        }]
      }
    }
    });
  res.redirect('/challenges/' + req.params.id);
});

module.exports = router;
