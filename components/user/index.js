var path = require('path');
var UserModel = require('./model/userModel')();

module.exports = function(app) {

  // hook model and other helpers into app
  app.user = {
    loggedIn: function(req, res, next) {
      if (req.session.user) {
        return next();
      }
      req.session.redirect = req.url;
      req.flash('Please log in first.');
      return res.redirect('/');
    },
    model: UserModel
  };

  var middleware = require('./middleware')(app);

  // ROUTES

  app.get('/', function signIn(req, res) {
    if (req.session.user) {
      return res.redirect('/dashboard');
    }
    return res.render(path.join(__dirname, 'view/signin'));
  });

  app.get('/settings', [
    middleware.checkPivotal,
    render('view/settings')
  ]);

  app.put('/settings', [
    middleware.updateUser,
    redirect('/settings')
  ]);

  app.get('/register', render('view/register'));

  app.post('/register', [
    middleware.doRegister,
    middleware.doSignIn
  ]);

  app.post('/signin', [
    middleware.doSignIn
  ]);

  app.all('/signout', [
    middleware.endSession,
    flash("You have been signed out."),
    redirect('/')
  ]);

};


// USER Methods

function render(view) {
  return function (req, res) {
    return res.render(path.join(__dirname, view));
  };
}

function redirect(url) {
  return function (req, res) {
    return res.redirect(url);
  };
}

function flash(message) {
  return function (req, res, next) {
    req.flash(message);
    return next();
  };
}