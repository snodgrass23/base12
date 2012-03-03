var express         = require('express'),
    stylus          = require('stylus'),
    RedisStore      = require('connect-redis')(express);

// Middleware

module.exports = function(app) {

  // Stylus
  var stylus_middleware = stylus.middleware({
    src: app.server.set('views'),
    dest: app.server.set('public'),
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
    store: new RedisStore()
  });

  // Error handler
  var error_middleware = express.errorHandler({
    dumpExceptions: true,
    showStack: true
  });

  // Middleware stack for all requests
  app.server.use(stylus_middleware);                              // Compile .styl to .css
  app.server.use(express.cookieParser(app.config.cookie_secret));         // req.cookies
  app.server.use(session_middleware);                             // req.session
  app.server.use(express.bodyParser());                           // req.body & req.files
  app.server.use(express.methodOverride());                       // '_method' property in body (POST -> DELETE / PUT)
  app.server.use(app.server.router);                              // routes.js
  app.server.use(express['static'](app.server.set('public')));    // Serve files from /public
  
  // Handle errors thrown from middleware/routes
  app.server.use(error_middleware);
};