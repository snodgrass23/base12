var passport = require('passport');

var filters = require('../lib/filters');
var crud = require('../lib/mongoose-crud');
var respond = require('../lib/express-respond');

/**
 * Users Controller
 */
 
exports = module.exports = {

  // Sign up form
  'new': [
    filters.is_user,
    function(req, res) {
      res.render('users/new');
    }
  ],

  // Sign up POST
  create: [
    crud.create(models.user, 'user'),
    function(req, res, next) {
      req.flash('info', "<strong>Account created.</strong> Welcome to " + options.appTitle + "!");
      return next();
    },
    passport.authenticate('local', { failureRedirect: '/sessions/login' }),
    function (req, res) { res.redirect('/'); }
  ],

  // Account edit form
  edit: [
    filters.require_self,
    function(req, res) {
      res.render('users/edit', {user: req.user});
    }
  ],

  // Account edit PUT
  update: [
    filters.require_self,
    crud.update('user'),
    function(req, res) {
      req.flash('info', '<strong>Account updated.</strong> Nice!');
      res.redirect('/');
    }
  ],

  // Upload new doc(s) via xhr or iframe
  doc: [
    filters.require_user,
    crud.create(models.userDoc, 'userdoc'),
    function(req, res) {
      respond(undefined, req, res, req.results.userdoc);
    }
  ],

  // User profile
  show: [
    filters.is_self,
    function(req, res) {
      res.render('users/show', {user: req.user, is_self: req.is_self, section: 'user'});
    }
  ],

  load: function(id, callback) {
    models.user.findById(id).populate('docs').run(function(err, result) {
      return callback(undefined, result);
    });
  }
};