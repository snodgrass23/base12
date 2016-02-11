#!/usr/bin/env node

// require('newrelic');

var express = require('express');

// Globals
_ = require('underscore');

// Require our base libs

var config      = require('./lib/config-load')();
var balance     = require('./lib/balance');
var middleware  = require('./lib/middleware');
var locals      = require('./lib/locals');
var flash       = require('./lib/flash');
var mongoose    = require('./lib/mongoose');
var redis       = require('./lib/redis');
var reload      = require('./lib/reload')();
var emailer     = require('./lib/emailer');

// Require our components

var user        = require('./components/user');
var dashboard   = require('./components/dashboard');
var errors      = require('./components/errors');


// Expose the app

module.exports = createApp;

// Decorate express with our components
// Marry the app to its running configuration

function createApp(config) {
  var app = express();
  app.config = app.locals.config = config;

  // libs
  mongoose(app, config);
  redis(app);
  // inject(app);
  middleware(app);
  locals(app);
  flash(app);
  emailer(app);
  reload();

  // components
  user(app, config);
  dashboard(app, config);
  errors(app, config);

  return app;
}

function startApp() {
  var app = createApp(config);
  app.listen(config.port);
  console.log("Listening on", config.port);
}

// Start listening if the app has been started directly

if (module === require.main) {
  var debugMode = ( process.execArgv &&
                    process.execArgv[0] &&
                    process.execArgv[0].indexOf('--debug') > -1);

  var simpleMode = ( process.argv[2] == 'simple' );

  if (debugMode || simpleMode) startApp();
  else balance(startApp);
}
