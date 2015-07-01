var db = require('monk')(process.env.MONGO_URI_CHALLENGES);
var challengeCollection = db.get('challenge');
var userCollection = db.get('user');

module.exports = {

  dailyScore: function(healthy_meals, unhealthy_meals, workouts, alcohol, water, perfect){
    var perf = 0;
    if (perfect == "on") {
      perf = 1;
    };
    var score = (parseInt(healthy_meals) * 3)
                + (parseInt(workouts) * 3)
                + (parseInt(water) * .5)
                + perf
                + (parseInt(alcohol) * -1)
                + (parseInt(unhealthy_meals) * -3);
    return score
  },

  displayIds: function(array){
    newArray = []
    for (var i = 0; i < array.length; i++) {
      newArray.push(userCollection.id(array[i]));
    };
    return newArray;
  },

  displayScores: function(challenge) {
    var newArray = [];
    for (var i = 0; i < challenge.user_ids.length; i++) {
      newArray.push([challenge.user_ids[i]])
    };

    for (var j = 0; j < newArray.length; j++) {
      for (var i = 0; i < challenge.challenge_length; i++) {
            newArray[j].push(0);
      };
    };

    for (var i = 0; i < newArray.length; i++) {
      for (var j = 0; j < challenge.scores.length; j++) {
        var hello = newArray[i][0];
        if(challenge.scores[j].user_id === hello){
          newArray[i][challenge.scores[j].day] = challenge.scores[j].score
        };
      };
    };
    return newArray;
  },

  totalScore: function(challengeScores){
    for (var i = 0; i < challengeScores.length; i++) {
      var total = 0;
      for (var j = 1; j < challengeScores[i].length; j++) {
        total += challengeScores[i][j]
      };
      challengeScores[i].push(total)
    };
    return challengeScores;
  },

};
