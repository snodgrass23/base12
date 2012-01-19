var express = require('express');
var Options = require('./config/options');
var reload = require('./lib/reload');

// server export
module.exports = {
  init: function() {

    // globals
    global.environment = process.env.NODE_ENV || 'development';
    global.options = Options([environment]);
    global.server = express.createServer();
    global.models = {};
    global.controllers = {};

    server.configure(function() {

      require('./config/server')();
      require('./config/middleware')();
      require('./config/models')();
      require('./config/controllers')();
      require('./config/authentication')();
      require('./config/helpers')();
      require('./config/routes')();
      require('./config/errors.js')();

      if (environment == 'development') {
        // server reload on file changes
        reload();
      }

    });

  },
  listen: function() {
    server.listen(options.port);
    console.log('[ ' + options.appname + " ] worker listening at: "  + options.host + ' on port ' + options.port + ' in ' + environment + ' environment.');
  }
};
