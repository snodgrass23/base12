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

module.exports = function(app) {

  app.server.use(connectTimeout({ time: app.config.timeout }));
  app.server.use(stylus.middleware({
    src: app.server.set('views'),
    dest: app.server.set('public'),
    debug: false,
    compileMethod: function(str) {
      return stylus(str, path)
        .set('compress', options.compressCss)
        .set('filename', path);
    },
    force: true
  }));
  app.server.use(express['static'](app.server.set('public')));
  app.server.use(express.cookieParser());
  console.log("SESSION CONFIG:", app.config.session);
  app.server.use(express.session({
    secret: app.config.session.secret,
    key: app.config.session.key,
    store: new connectRedis({
      maxAge: app.config.redis.expires,
      host: app.config.redis.host,
      port: app.config.redis.port
    })
  }));
  app.server.use(form({ keepExtensions: true }));
  app.server.use(express.bodyParser());
  app.server.use(express.methodOverride());
  app.server.use(passport.initialize('currentUser'));
  app.server.use(passport.session());
  app.server.use(app.server.router);

  app.server.error(function(err, req, res, next) {
    // Handle errors
  });
};