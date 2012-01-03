
/**
 * Setup routes
 */

exports = module.exports = function() {
  
  // Home
  server.resource('homes', controllers.home);
  server.all('/', controllers.auth.is_not_user, controllers.home.index);

  // Login Sessions
  server.resource('sessions', controllers.session)
    .map('all', '/login', controllers.session['new'])
    .map('all', '/logout', controllers.session.destroy);

  // Users
  server.resource('users', controllers.user)
    .map('all', '/account', controllers.user.edit);

  /*
  server.get('/', controllers.auth.is_not_user, controllers.home.index);
  server.get('/login', controllers.users.login);
  server.post('/login', controllers.auth.create_session);
  server.get('/register', controllers.users['new']);
  server.post('/register', controllers.users.create);
  server.get('/logout', controllers.auth.destroy_session);

  server.get('/account', controllers.auth.is_user, controllers.users.edit);

  // fallback for controller/action loading

  server.all('/:controller/:action?/:id?', controllers.auth.is_user, findControllerAction);

  // route not found, send to error page

  server.all('/:a/:b?/:c?/:d?/:e?/:f?', pageNotFound);
  */

};