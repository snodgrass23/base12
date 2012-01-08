var passport = require('passport');

var filters = require('../lib/filters');

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
    function(req, res, next) {
      var user = new models.user(req.body);
      console.log('req.body:', req.body);
      user.save(function(err){
        if (err) {
          console.log(err);
          req.flash(err);
          return next();
       }
        else {
          req.flash('info', "Account created. Welcome to " + options.appTitle + "!");
          return next();
        }
      });
    },
    passport.authenticate('local', { failureRedirect: '/sessions/login' }),
    function (req, res) { res.redirect('/'); }
  ],

  // Account edit form
  edit: [
    filters.require_self,
    function(req, res) {
      res.render('users/edit');
    }
  ],

  // Account edit POST
  update: [
    filters.require_self,
    function(req, res) {
      console.log('req.user = ', req.user);
      models.user.updateById(req.user._id, req.body, function(err, updated_user) {
        if (updated_user) {
          req.flash('info', 'Account updated');
          return res.redirect('/');
        }
        else {
          req.flash('error', 'Unable to update user');
          return res.redirect('/');
        }
      });
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
    models.user.findById(id, callback);
  }
};