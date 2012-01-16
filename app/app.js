// server export

exports = module.exports = (function() {

  environment = process.env.NODE_ENV || 'development';
  options = require('./config/options')([environment]);
  server = require('express').createServer();
  models = {};
  controllers = {};
  _ = require('underscore');
  async = require('async');

  console.log("Environment in server: " + environment);

  // Config (all)

  server.configure(function() {

    // Settings

    require('./config/server')();

    // Middleware

    require('./config/middleware')();

    // Models
    
    require('./config/models')();
    
    // Initialize controllers global
    
    require('./config/controllers')();
    
    // Authentication

    require('./config/authentication')();

    // Helpers

    require('./config/helpers')();

    // Map routes

    require('./config/routes')();

    // Handle errors

    require('./config/errors.js')();

    // server reload on file changes
    
    if (environment == 'development') {
      var reload = require('./lib/reload')();
      reload();
    }

  });

})();
