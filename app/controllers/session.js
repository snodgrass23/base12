var passport = require('passport');

var filters = require('../lib/filters');

/**
 * Actions
 */

module.exports = {
  
  // Login form
  'new': [
    filters.is_user,
    function(req, res) {
      res.render('sessions/new');
    }
  ],

  // Login POST
  // TODO: Check referrer to prevent login attacks
  create: [
    passport.authenticate('local', { failureRedirect: '/sessions/fail' }),
    function (req, res) { res.redirect('/'); }
  ],

  fail: [
    function(req, res, next) {
      req.flash('error', '<strong>Login failed:</strong> Double-check and try again?');
      res.redirect('/sessions/login');
    }
  ],

  // Logout
  destroy: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};