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

  displayScores: function(array){
    console.log(array);
    for (var i = 0; i < array.length; i++) {
      array[i]
    }
  }

};
