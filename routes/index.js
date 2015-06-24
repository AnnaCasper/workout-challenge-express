var express = require('express');
var router = express.Router();

var db = require('monk')('localhost/workout-challenge');
var challenge = db.get('challenge');
var functions = require('../public/javascripts/logic.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Workout Challenge' });
});

router.get('/challenges', function(req, res, next){
  challenge.find({}, function(err, data){
    res.render('challenges/index', {allScores: data});
  });
});

router.get('/challenges/new', function(req, res, next){
  res.render('challenges/new');
});

router.post('/challenges', function(req, res, next){
  var dailyTotal = functions.dailyScore(req.body.healthy_meals, req.body.workouts, req.body.unhealthy_meals, req.body.alcohol, req.body.water, req.body.calorie);
  challenge.insert(
    {name: req.body.names,
    day1: dailyTotal,
    day2: 0,
    day3: 0,
    day4: 0,
    day5: 0,
    day6: 0,
    day7: 0,
    day8: 0,
    day9: 0,
    day10: 0,
    day11: 0,
    day12: 0,
    day13: 0,
    day14: 0,
    day15: 0,
    day16: 0,
    day17: 0,
    day18: 0,
    day19: 0,
    day20: 0,
    day21: 0,
    });
  res.redirect('/challenges');
});

router.get('/challenges/:id', function(req, res, next){
  challenge.findOne({ _id: req.params.id}, function(err, data){
    res.render('challenges/show', {thisPlayer: data});
  });
});

router.get('/challenges/:id/edit', function(req, res, next){
  challenge.findOne({_id: req.params.id}, function(err, data){
    res.render('challenges/edit', {thisPlayer: data});
  })
})

router.post('/challenges/:id/edit', function(req, res, next){
  var totalScore = functions.dailyScore(req.body.healthy_meals, req.body.workouts, req.body.unhealthy_meals, req.body.alcohol, req.body.water, req.body.calorie);
  var day = req.body.day;
  challenge.insert({_id: req.params.id}, {$set: { day : totalScore}});
  res.redirect('/challenges/' + req.params.id)
})

router.post('/challenges/:id/delete', function(req, res, next){
  challenge.remove({_id: req.params.id});
  res.redirect('challenges/index');
})


module.exports = router;
