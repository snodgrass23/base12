var base12 = require('base12');

var locals = require('./lib/locals');
var middleware = require('./lib/middleware');
var routes = require('./lib/routes');

module.exports = base12.app({
  dir: __dirname,                             // Load Models, Views, Middleware, Controllers, Locals
  init: [locals, middleware, routes]          // Steps to initialize your app
});