var express = require('express');
var router = express.Router();

var db = require('monk')(process.env.MONGO_URI_CHALLENGES);
var challengeCollection = db.get('challenge');

var db2 = require('monk')(process.env.MONGO_URI_USERS);
var userCollection = db2.get('user');

var functions = require('../public/javascripts/logic.js')
var validations = require('../public/javascripts/validations.js')

var bcrypt = require('bcryptjs');

// GET home page/login page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Workout Challenge' });
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
  res.render('users/new');
});

//POST new user
router.post('/users/new', function(req, res, next){
  var errors = validations.validateSignUp(req.body.user_name, req.body.email, req.body.password, req.body.confirm);
    if (errors.length > 0){
      res.render('users/new', {errors: errors, user_name: req.body.user_name, email: req.body.email});
    } else {
      var hash = bcrypt.hashSync(req.body.password, 8);
      userCollection.insert({user_name: req.body.user_name, email: req.body.email, password: hash});
      userCollection.findOne({email: req.body.email}, function(err, data){
        res.cookie('currentUser', data._id);
        res.redirect('/challenges');
      });
    };
});

// GET new challenge page
router.get('/challenges/new', function(req, res, next){
  res.render('challenges/new');
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
      start_date: req.body.start_date});
    res.redirect('/challenges');
  } else {
    res.render('challenges/new', {
      errors: errors,
      challenge_name: req.body.challenge_name,
      challenge_length: req.body.challenge_length,
      start_date: req.body.start_date
      });
  };
});

//GET challenges index page
router.get('/challenges', function(req, res, next){
  challengeCollection.find({}, function(err, data){
    res.render('challenges/index', {allChallenges: data});
  });
});

//GET show challenge page
router.get('/challenges/:id', function(req, res, next){
  challengeCollection.findOne({_id: req.params.id}, function(err, data){
    res.render('challenges/show', { thisChallenge: data});
  });
});

//join this challenge
router.post('/join', function(req, res, next){

})

//GET edit challenge page
router.get('/challenges/:id/edit', function(req, res, next){
  challengeCollection.findOne({_id: req.params.id}, function(err, data){
    res.render('challenges/edit', { thisChallenge: data});
  });
});

//POST edits to challenge in database
router.post('/challenges/:id/edit', function(req, res, next){
  challengeCollection.update({_id: req.params.id},
    {$set: {
      challenge_name: req.body.challenge_name,
      challenge_length: req.body.challenge_length,
      start_date: req.body.start_date
      }});
  res.redirect('/challenges/' + req.params.id)
});

//POST remove challenge in database
router.post('/challenges/:id', function(req, res, next){
  challengeCollection.remove({_id: req.params.id});
  res.redirect('/challenges');
});

//GET show user profile

//POST user logout
router.post('/logout', function(req, res, next){
  res.clearCookie('currentUser');
  res.redirect('/');
});



module.exports = router;
