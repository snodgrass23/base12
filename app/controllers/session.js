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
    passport.authenticate('local', { failureRedirect: '/sessions/login' }),
    function (req, res) { res.redirect('/'); }
  ],

  // Logout
  destroy: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};