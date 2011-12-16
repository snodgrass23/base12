/**
 * Users Controller
 */
 
exports = module.exports = {

  index:function(req, res) {
    models.user.find({}, function(err, result){
      res.render('users/index', {err:err, result:result});
    });
  },

  show: function(req, res) {
    res.render('users/show', {user_id: req.param('id'), section: 'profile'});
  },

  login: function(req, res) {
    res.render('users/login');
  },

  'new': function(req, res) {
    res.render('users/new');
  },

  create: function(req, res) {
    var user = new models.user(req.body);
    user.save(function(err){
      if (err) {
        console.log(err);
        models.flashErrors(err, req);
        res.redirect('/register');
     }
      else {
        req.flash('info', "Account created. Welcome to Clickdummy!");
        controllers.auth.create_session(req, res);  
      }
    });
  },

  edit: function(req, res) {
    res.render('users/edit');
  },

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
  }

};