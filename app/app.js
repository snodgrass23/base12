var express = require('express');
var options = require('./config/options');

// server export
exports = module.exports = (function() {

  // Globals
  GLOBAL.environment = process.env.NODE_ENV || 'development';
  GLOBAL.options = options([environment]);
  GLOBAL.server = express.createServer();
  GLOBAL.models = {};
  GLOBAL.controllers = {};

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
