var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
module.exports = function(app) {

  /**
   * Authentication strategies
   */

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      console.log("WTF");
      app.models.user.find_with_password({ email: email }, password, function (err, user) {
        console.log("OK");
        if (!user) return done(err);
        else return done(undefined, user);
      });
    }
  ));

  /**
   * Serialization (to/from DB)
   */

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    app.models.user.findById(id, function(err, found_user) {
      done(err, found_user);
    });
  });
};