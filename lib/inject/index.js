module.exports = function(app) {
  app.inject = inject;
};

// app.inject()
function inject(key, fn) {
  if (arguments.length === 1) {
    createInjector(this, key);
    return;
  }
  var injection = this.injections[key];       // this === app
  var index = -1;
  this.stack.forEach(function(middleware, i) {
    if (middleware.handle === injection) index = i;
  });
  if (index !== -1) {
    this.stack.splice(index + 1, 0, {
      route: '',
      handle: fn
    });
  }
}

function createInjector(app, key) {
  app.injections = app.injections || {};
  app.injections[key] = injection;
  app.use(injection);

  function injection(req, res, next) {
    return next();
  }
}