var express         = require('express'),
    connect         = require('connect'),
    stylus          = require('stylus'),
    RedisStore      = require('connect-redis')(express);

// Middleware

module.exports = function(app) {

  // Stylus
  var stylus_middleware = stylus.middleware({
    src: app.set('views'),
    dest: app.set('public'),
    debug: false,
    compileMethod: function(str) {
      return stylus(str, path)
        .set('compress', options.compressCss)
        .set('filename', path);
    },
    force: true
  });

  // Sessions
  var session_middleware = express.session({
    key: app.config.session_key,
    cookie: { secure: true },
    store: new RedisStore(),
    maxAge: app.config.session_length
  });

  // Timeouts
  var timeout_middleware = connect.timeout({
    throwError: true,
    time: app.constants.request_timeout
  });

  // Error handler
  var error_middleware = express.errorHandler({
    dumpExceptions: true,
    showStack: true
  });

  // Middleware stack for all requests
  app.use(timeout_middleware);                              // request timeouts
  app.use(express.compress());                              // gzip
  app.use(stylus_middleware);                               // Compile .styl to .css
  app.use(express.cookieParser(app.config.cookie_secret));  // req.cookies
  app.use(session_middleware);                              // req.session
  app.use(express.bodyParser());                            // req.body & req.files
  app.use(express.methodOverride());                        // '_method' property in body (POST -> DELETE / PUT)
  app.use(app.router);                                      // routes in lib/routes.js
  app.use(express['static'](app.set('public')));            // static files in /public
  
  // Handle errors thrown from middleware/routes
  app.use(error_middleware);
};