var express         = require('express'),
    connect         = require('connect'),
    stylus          = require('stylus'),
    connect_timeout = require('connect-timeout'),
    MongoServer     = require('mongodb').Server,
    MongoStore      = require('connect-mongodb');

// Middleware

module.exports = function(app) {

  // Stylus
  var stylus_middleware = stylus.middleware({
    src: app.set('views'),
    dest: app.set('public'),
    debug: false,
    compile: function(str, path) {
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
    },
    force: true
  });

  // Sessions
  var mongoStore = new MongoStore({
    url: app.config.session.url
  });

  var session_middleware = express.session({
    key: app.config.session_key,
    cookie: { secure: true },
    store: mongoStore,
    maxAge: app.config.session_length
  });

  // Error handler
  var error_middleware = express.errorHandler({
    dumpExceptions: true,
    showStack: true
  });

  // Middleware stack for all requests
  app.use(stylus_middleware);                                         // Compile .styl to .css
  app.use(express['static'](app.set('public')));                      // static files in /public
  app.use(connect_timeout({ time: app.constants.request_timeout }));  // request timeouts
  app.use(express.cookieParser(app.config.cookie_secret));            // req.cookies
  app.use(session_middleware);                                        // req.session
  app.use(express.bodyParser());                                      // req.body & req.files
  app.use(express.methodOverride());                                  // '_method' property in body (POST -> DELETE / PUT)
  app.use(require('strobe').flash);
  app.use(require('restfuljs').response);
  app.use(app.router);                                                // routes in lib/routes.js
  
  // Handle errors thrown from middleware/routes
  app.use(error_middleware);
};
