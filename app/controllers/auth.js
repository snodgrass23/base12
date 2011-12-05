/**
 * Auth Controller
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    models.user.findOne({ email: email}, function (err, user) {
      if (err) return done(err);
      if (!user) return done(undefined, false);
      return done(undefined, user);
    });    
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.user.findById(id, function (err, user) {
    done(err, user);
  });
});

exports.create_session = function(req, res) {
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
};

exports.destroy_session = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Filters

exports.is_user = function(req, res, next) {
  if (req.user) return next();
  console.log("not logged in, redirecting");
  res.redirect('/login');
};

exports.is_not_user = function(req, res, next) {
  if (!req.user) return next();
  res.redirect(options.logged_in_homepage);
};