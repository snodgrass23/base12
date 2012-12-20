var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');

module.exports = function(app) {
  var logger = require('./logger')(app);
  var timeouts = timeout({
    throwError: true,
    time: app.config.request_timeout
  });
  var stylus = require('./stylus')(app);
  var staticFiles = express['static'](path.join(__dirname, '../../public'));
  var cookies = express.cookieParser(app.config.session_secret);
  var sessions = require('./sessions')(app);

  // Settings
  app.set('view engine', 'jade');

  // Middleware
  app.use(logger);
  app.use(timeouts);
  app.use(express.compress());
  app.use(stylus);
  app.inject('statics');
  app.inject('statics', staticFiles);
  app.use(cookies);
  app.use(sessions);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
};