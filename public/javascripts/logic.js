module.exports = {

  dailyScore: function(healthy_meals, unhealthy_meals, workouts, alcohol, water, perfect){
    var perf = 0;
    if (perfect === "on") {
      perf = 1;
    };
    return Number(healthy_meals * 3)
            + Number(workouts * 3)
            + Number(unhealthy_meals * -3)
            + Number(alc * -1)
            + Number(wat * .5)
            + Number(perf)
  },

};
