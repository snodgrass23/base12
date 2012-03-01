
module.exports = function(app) {
  
  // Home
  app.server.resource(app.controllers.home);

  // Login Sessions
  app.server.resource('sessions', app.controllers.session)
    .map('all', '/login', 'new')
    .map('all', '/fail', 'fail')
    .map('all', '/logout', 'destroy');

  // Users
  app.server.resource('users', app.controllers.user)
    .map('post', '/docs', 'doc');

};