/**
 * Users Controller
 */
 
exports = module.exports = {

  index:function(req, res) {
    models.user.find({}, function(err, result){
      res.render('users/index', {drawer:'pages_drawer', err:err, result:result});
    });
  },

  show: function(req, res) {
    res.render('users/show');
  },

  login: function(req, res) {
    res.render('users/login');
  },

  'new': function(req, res) {
    res.render('users/new');
  },

  create: function(req, res) {
    var user = new models.user(req.body);
    user.save(function(){
      res.redirect('/');
    });
  }

}; 