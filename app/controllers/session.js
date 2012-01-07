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
  'new': [
    controllers.filters.is_user,
    function(req, res) {
      res.render('sessions/new');
    }
  ],

  // Login POST
  // TODO: Check referrer to prevent login attacks
  create: function(req, res) {
    console.log("========");
    passport.authenticate('local', function(err, user, profile) {
      console.log("Authentication complete...");
      if (!err && user) {
        console.log("User found, logging in...");
        return req.login(user, function(err) {
          console.log("Done.");
          res.redirect(server.dynamicViewHelpers.account_route(req));
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
    req.logout();
    res.redirect('/');
  }
};