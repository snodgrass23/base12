var path        = require('path');
var serveStatic = require('serve-static');
var UserModel   = require('./model/userModel')();

module.exports = function(app) {

  app.use(serveStatic(path.join(__dirname, 'public')));

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

 app.get('/', [
    addParams,
    function (req, res) {
      if (req.session.user) {
        if (req.session.user.resetPassword) {
          req.session.user.resetPassword = false;
          UserModel.findByIdAndUpdate(req.session.user._id, {resetPassword:false}, function(){});
          req.flash("Would you like to update your password to something more memorable?");
          return res.redirect('/settings');
        }
        return res.redirect('/dashboard');
      }
      return res.render(path.join(__dirname, 'view/signin'));
    }
  ]);

  app.get('/settings', [
    render('settings')
  ]);

  app.put('/settings', [
    middleware.updateUser,
    redirect('/settings')
  ]);

  app.get('/register', [
    addParams,
    render('register')
  ]);

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

  app.get('/reset', [
    render('reset')
  ]);

  app.post('/reset', [
    middleware.resetPassword
  ]);

};


// USER Methods

function render(view) {
  return function (req, res) {
    return res.render(path.join(__dirname, 'view/'+view));
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

function addParams(req, res, next) {
  res.locals.querystring = req.query;
  return next();
}
