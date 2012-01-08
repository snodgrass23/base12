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
  create: function(req, res) {
    var user = new models.user(req.body);
    console.log('req.body:', req.body);
    user.save(function(err){
      if (err) {
        console.log(err);
        req.flash('err');
        res.redirect('/profiles/new');
     }
      else {
        req.flash('info', "Account created. Welcome to " + options.appTitle + "!");
        controllers.session.create(req, res);
      }
    });
  },

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
      if (req.user && req.user.id) {
        var user = models.user.findById(req.user.id, function(err, user) {
          
          if (err || !user) {
            req.flash("user not found to update");
            return res.redirect('/account');
          }
          _.extend(user, req.body);
          user.save(function(err) {
            if (err) models.flashErrors(err, req);
            else req.flash('info', "Account updated");
            res.redirect('/');
          });
        });
      }
      else {
        req.flash('info', "Bad request to user update.");
        res.redirect('/account');
      }
    }
  ],

  // User profile
  show: [
    filters.is_self,
    function(req, res) {
      res.render('users/show', {profile: req.profile, is_self: req.is_self, section: 'profile'});
    }
  ],

  load: function(id, callback) {
    callback(undefined, {name: 'Username'});
  }
};