var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
module.exports = function() {

  /**
   * Authentication strategies
   */

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      models.user.find_with_password({ email: email, password: password}, function (err, user) {
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
    models.user.findById(id, function(err, found_user) {
      done(err, found_user);
    });
  });
};