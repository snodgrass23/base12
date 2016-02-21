var path        = require('path');
var serveStatic = require('serve-static');

module.exports = function(app) {

  app.use(serveStatic(path.join(__dirname, 'public')));

  app.get('/dashboard', app.user.loggedIn, function(req, res) {
    return res.render(path.join(__dirname, 'dashboard'), {
      user: req.session.user
    });
  });
};
