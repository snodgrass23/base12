/**
 * Setup routes
 */

exports = module.exports = function() {
  
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

};


// function to find controller and action matching route
// if not found, send to 404 page
function findControllerAction(req, res, next) {
  var controller = req.params.controller,
      action = req.params.action || 'index',
      id = req.params.id;
  
  // check if route is using 'get' and trying to access an action that shouldn't accept them
  var no_gets = ['create', 'update', 'destroy'];
  if (req.route.method == 'get' && no_gets.indexOf(action) > -1) return next();

  if (controllers[controller] && controllers[controller][action]) {
    controllers[controller][action](req, res, next);
  }
  else {
    next();
  }
}

function pageNotFound(req, res, next) {
  controllers.home.error(req, res);
}
