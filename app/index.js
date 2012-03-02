var base12 = require('../lib/base12');

var constants = require('./lib/constants');
var persistence = require('./lib/persistence');
var middleware = require('./lib/middleware');
var authentication = require('./lib/authentication');
var routes = require('./lib/routes');

module.exports = new base12.App({
  dir: __dirname,                             // Load Models, Views, Middleware, Controllers, Helpers
  constants: constants,                           // Options that do not change between machines / deploys (config that changes should go in .env)
  init: [persistence, authentication, middleware, routes]  // Steps to initialize your app
});