module.exports = {

  dailyScore: function(healthy_meals, workouts, unhealthy_meals, alcohol, water, calorie){
    var alc = 0;
    if (alcohol === "on") {
      alc = -2;
    };
    var wat = 0;
    if (water === "on") {
      wat = 1;
    };
    var cal = 0;
    if (calorie === "on") {
      cal = 1;
    };
    return Number(healthy_meals * 2) + Number(workouts * 3) + Number(unhealthy_meals * -3) + Number(alc) + Number(wat) + Number(cal)
  },

  totalScore: function(){

  },

};
