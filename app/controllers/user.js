/**
 * Users Controller
 */
 
exports = module.exports = {

  // Sign up form
  'new': function(req, res) {
    res.render('users/new');
  },

  // Sign up POST
  create: function(req, res) {
    var user = new models.user(req.body);
    user.save(function(err){
      if (err) {
        console.log(err);
        models.flashErrors(err, req);
        res.redirect('/users/new');
     }
      else {
        req.flash('info', "Account created. Welcome to " + options.appname + "!");
        controllers.auth.create_session(req, res);
      }
    });
  },

  // Account edit form
  edit: function(req, res) {
    res.render('users/edit');
  },

  // Account edit POST
  update: function(req, res) {
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
  },

  // List users
  index: function(req, res) {
    models.user.find({}, function(err, result){
      res.render('users/index', {err:err, result:result});
    });
  },

  // User profile
  show: function(req, res) {
    res.render('users/show', {user_id: req.param('id'), section: 'profile'});
  }
};