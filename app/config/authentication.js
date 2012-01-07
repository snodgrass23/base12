var passport = require('passport');

/**
 * Authentication strategies
 */

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    models.user.find_by_login({ email: email, password: password}, function (err, user) {
      if (err) return done(err);
      if (!user) return done(undefined, false);
      return done(undefined, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  console.log("Deserializing:", id);
  models.user.findById(id, function(err, found_user) {
    console.log("Error:", err);
    console.log("Found user:", found_user);
    done(err, found_user);
  });
});