/**
 * Auth Controller
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

/**
 * Actions
 */

module.exports = {
  
  // Login form
  'new': function(req, res) {
    res.render('sessions/new');
  },

  // Login POST
  create: function(req, res) {
    console.log("========");
    passport.authenticate('local', function(err, user, profile) {
      console.log("Authentication complete...");
      if (!err && user) {
        console.log("User found, logging in...");
        return req.login(user, function(err) {
          console.log("Done.");
          res.redirect(options.logged_in_homepage);
        });
      }
      else {
        console.log("User not found", err, user);
        res.redirect('/login');
      }
    })(req, res);
  },

  // Logout
  destroy: function(req, res) {
    console.log("DESTROY");
    req.logout();
    res.redirect('/');
  }
};

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