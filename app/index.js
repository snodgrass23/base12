var ion = require('../lib/ion');

var options = require('./lib/options');
var persistence = require('./lib/persistence');
var middleware = require('./lib/middleware');
var authentication = require('./lib/authentication');
var routes = require('./lib/routes');

module.exports = new ion.App({
  dir: __dirname,                             // Load Models, Views, Controllers, Helpers
  options: options,                           // Options that do not change between machines / deploys (config that changes should go in .env)
  init: [persistence, authentication, middleware, routes]  // Steps to initialize your app
});