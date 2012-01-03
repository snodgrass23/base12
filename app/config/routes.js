
exports = module.exports = function() {
  
  // Home
  server.resource(controllers.home);

  // Login Sessions
  server.resource('sessions', controllers.session)
    .map('all', '/login', 'new')
    .map('all', '/logout', 'destroy');

  // Users
  server.resource('profiles', controllers.user);

};