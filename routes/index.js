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

//login
router.post('/login', function(req, res, next){
  userCollection.findOne({ email: req.body.login_email}, function(err, data){
    var compare = bcrypt.compareSync(req.body.login_password, data.password);
    if (compare === true){
      res.cookie('currentUser', req.body.login_email);
      res.redirect('/challenges');
    };
  });
});

//GET new user page
router.get('/users/new', function(req, res, next){
  res.render('users/new');
});

//POST new user
router.post('/signup', function(req, res, next){
  var validEmail = validations.validEmail(req.body.email);
  var uniqueEmail = userCollection.find({email: req.body.email}, function(err, data){
    if(data){
      return "There is already a user with this email. Please enter a unique email address."
      };
    });
  var passwordMatch = validations.passwordMatch(req.body.password, req.body.confirm);
  var passwordLength = validations.passwordLength(req.body.password);
  var blankCells = validations.blankCells(req.body.user_name, req.body.email, req.body.password, req.body.confirm);
  var errorArray = [];
  errorArray.push(validEmail, uniqueEmail, passwordMatch, passwordLength, blankCells);
  if (errorArray.length = 0){
    var hash = bcrypt.hashSync(req.body.password, 8);
    userCollection.insert({user_name: req.body.user_name, email: req.body.email, password: hash});
    res.cookie('currentUser', req.body.email);
    res.redirect('/challenges');
  } else {
    res.render('/users/new', { errors: errorArray});
  }
});

// GET new challenge page
router.get('/challenges/new', function(req, res, next){
  res.render('challenges/new');
});

// POST new challenge in database
router.post('/challenges', function(req, res, next){
  challengeCollection.insert({
    challenge_name: req.body.challenge_name,
    challenge_length: req.body.challenge_length,
    start_date: req.body.start_date});
  res.redirect('/challenges');
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

//GET new user page



module.exports = router;
