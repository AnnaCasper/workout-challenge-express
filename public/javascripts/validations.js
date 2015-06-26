module.exports = {

  validEmail: function(input){
    if(input.includes('@')){
    } else {
      return "Email must be a valid email address."
    };
  },

  passwordMatch: function(password, confirm){
    if(password === confirm){
    } else {
      return "Passwords do not match."
    };
  },

  passwordLength: function(password){
    if(password.length < 8){
      return "Password must be at least 8 characters long."
    };
  },

  blankCells: function(name, email, password, confirm){
    if(name || email || password || confirm === ""){
      return "All cells must be filled out."
    };
  },

};
