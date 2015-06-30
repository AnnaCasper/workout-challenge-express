var db = require('monk')(process.env.MONGO_URI_CHALLENGES);
var challengeCollection = db.get('challenge');
var userCollection = db.get('user');

module.exports = {

  validateSignUp: function(name, email, password, confirm){
    var errorArray = [];
    userCollection.find({email: email}, function(err, data){

      if(password !== confirm){
        errorArray.push("Passwords do not match.");
      };

      if(password.length < 8){
        errorArray.push("Password must be at least 8 characters long.");
      };

      if(name == "" || name == null){
        errorArray.push("Name must be filled out.");
      };

      if(email == "" || email == null){
        errorArray.push("Email must be filled out.");
      };

      if(password == "" || password == null){
        errorArray.push("Password must be filled out.");
      };

      if(confirm == "" || confirm == null){
        errorArray.push("Password confirmation must be filled out.");
      };

      // if(email.includes('@')){
      // } else {
      //   errorArray.push("Email must be a valid email address.");
      // };

      if (data){
        errorArray.push("There is already an account associated with this email address. Please enter a unique email.")
      };

      return errorArray;
    });

  },

  validateNewChallenge: function(challenge_name, challenge_length, start_date){
    var errorArray = [];
    if(challenge_name == "" || challenge_name == null){
      errorArray.push("Challenge name must be filled out.");
    };

    if(challenge_length == "" || challenge_length == null){
      errorArray.push("Challenge length must be filled out.");
    };

    if(start_date == ""){
      errorArray.push("Challenge start date must be filled out.")
    };

    return errorArray;
  },

  validateNewScore: function(challenge_id, currentUser, healthy_meals, unhealthy_meals, workouts, alcohol, water, perfect, user_ids, scores, day){
    var errorArray = [];
      console.log(scores);
      var y = scores.indexOf({user_id: currentUser, day: day, });
      console.log(y);
      var x = user_ids.indexOf(currentUser);
      if( x === -1){
        errorArray.push("You must go back and join this challenge before you can enter a score.")
      }

      if(healthy_meals == "" || isNaN(healthy_meals)){
        errorArray.push("Healthy meals must be filled out in number form.");
      };

      if(unhealthy_meals == "" || unhealthy_meals == null){
        errorArray.push("Unhealthy meals must be filled out.");
      };

      if(workouts == "" || workouts == null){
        errorArray.push("Workouts must be filled out.");
      };

      if(alcohol == "" || alcohol == null){
        errorArray.push("Alcoholic drinks must be filled out in number form.");
      };

      if(water == "" || isNaN(water)){
        errorArray.push("Glasses of water must be filled out in number form.");
      };
    return errorArray;
  },

};
