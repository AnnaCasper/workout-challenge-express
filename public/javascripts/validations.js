module.exports = {

  validateSignUp: function(name, email, password, confirm){
    var errorArray = [];
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

    // unique email func

    return errorArray;
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

};
