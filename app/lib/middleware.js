var connectTimeout  = require('connect-timeout'),
    express         = require('express'),
    form            = require('connect-form'),
    resource        = require('express-resource'),
    mongoose        = require('mongoose'),
    stylus          = require('stylus'),
    util            = require('util'),
    passport        = require('passport'),
    connectRedis    = require('connect-redis')(require('connect')),
    redis           = require('redis');

// Middleware

module.exports = function(server, config) {

  server.use(connectTimeout({ time: options.reqTimeout }));
  server.use(stylus.middleware({
    src: server.set('views'),
    dest: server.set('public'),
    debug: false,
    compileMethod: function(str) {
      return stylus(str, path)
        .set('compress', options.compressCss)
        .set('filename', path);
    },
    force: true
  }));
  server.use(express['static'](server.set('public')));
  server.use(express.cookieParser());
  server.use(express.session({
    secret: 'my_secret_session',
    key: options.sessionKey,
    store: new connectRedis({
      maxAge: options.maxAge,
      host: options.redis.host,
      port: options.redis.port
    })
  }));
  server.use(form({ keepExtensions: true }));
  server.use(express.bodyParser());
  server.use(express.methodOverride());
  server.use(passport.initialize('currentUser'));
  server.use(passport.session());
  server.use(server.router);

  // Log errors we send to users
  server.error(respond.log);
  
  // If a route throws an error, handle it by providing an error flash or an error JSON code
  server.error(respond.error);

  // Then bounce the user back to the previous page & flash the message (if not JSON/xhr)
  server.error(respond.bounce);
};