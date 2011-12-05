// server export

exports = module.exports = (function() {

  environment = process.env.NODE_ENV || 'development';
  options = require('./config/options')([environment]);
  server = require('express').createServer();
  models = {};
  controllers = {};

  console.log("Environment in server: " + environment);

  // Config (all)

  server.configure(function() {

    // Settings

    require('./config/setup_server')();

    // Middleware

    require('./config/middleware')(require('express'));

    // Models
    
    require('./config/setup_models')();
    
    // Initialize controllers global
    
    require('./config/setup_controllers')();    
    
    // Helpers

    require('./config/helpers')();

    // Map routes

    require('./config/routes')();

  });

  // Handle errors

  require('./config/errors.js')();

})();
