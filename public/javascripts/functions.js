var db = require('monk')(process.env.MONGO_URI_CHALLENGES);
var challengeCollection = db.get('challenge');

var db2 = require('monk')(process.env.MONGO_URI_USERS);
var userCollection = db2.get('user');

module.exports = {

  dailyScore: function(healthy_meals, unhealthy_meals, workouts, alcohol, water, perfect){
    var perf = 0;
    if (perfect === "on") {
      perf = 1;
    };
    return Number(healthy_meals * 3)
            + Number(workouts * 3)
            + Number(unhealthy_meals * -3)
            + Number(alcohol * -1)
            + Number(water * .5)
            + Number(perf)
  },

  displayIds: function(array){
    newArray = []
    for (var i = 0; i < array.length; i++) {
      newArray.push(userCollection.id(array[i]));
    };
    return newArray;
  },

};
