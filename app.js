#!/usr/bin/env node

var express = require('express');

// Globals
_ = require('underscore');
async = require('async');

// Require our base libs

var config      = require('./lib/config-load')();
var inject      = require('./lib/inject');
var balance     = require('./lib/balance');
var middleware  = require('./lib/middleware');
var locals      = require('./lib/locals');
var flash       = require('./lib/flash');
var mongoose    = require('./lib/mongoose');
var redis       = require('./lib/redis');
var reload      = require('./lib/reload')();

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
  inject(app);
  middleware(app);
  locals(app);
  flash(app);
  reload();

  // components
  user(app, config);
  dashboard(app, config);
  errors(app, config);

  return app;
}

function startApp() {
  var app = createApp(config);
  app.listen(config.http_port);
  console.log("Listening on", config.http_port);
}

// Start listening if the app has been started directly

if (module === require.main && config.cluster) {
  balance(function() {
    startApp();
  });
}
else {
  startApp();
}