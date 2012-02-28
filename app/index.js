var ion = require('../lib/ion');

var options = require('./lib/options');
var middleware = require('./lib/middleware');
var authentication = require('./lib/authentication');
var routes = require('./lib/routes');

module.exports = new ion.App({
  dir: __dirname,                             // Load Models, Views, Controllers, Helpers
  options: options,                           // Options that do not change between machines / deploys (config that changes should go in .env)
  init: [middleware, authentication, routes]  // Steps to initialize your app
});