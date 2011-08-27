// Establish a working directory

var root = require('path').normalize(__dirname + '/..');

// Modules

var express = require('express'),
    connectTimeout = require('connect-timeout'),
    stylus = require('stylus'),
    context = require('../lib/context');

require('../lib/math.uuid');

// Server export

exports = module.exports = (function() {
  
  var server = express.createServer(),
      options = require('./config/constants')([server.set('env')]);

  console.log("Environment: " + server.set('env'));
  
  // Config (all)
  
  server.configure(function() {
    
    // Settings
    
    server.set('app root', root + '/app')
    server.set('view engine', options.view_engine || 'jade')
    server.set('views', server.set('app root') + '/views')
    server.set('public', server.set('app root') + '/public');
    server.set('port', options.port);
    server.set('host', options.host);
    
    // Middleware
    
    server.use(connectTimeout({ time: options.reqTimeout }));
    server.use(stylus.middleware({
      src: server.set('views'),
      dest: server.set('public'),
      debug: true,
      compileMethod: function(str) {
        return stylus(str, path)
          .set('compress', options.compressCss)
          .set('filename', path);
      },
      force: true
    }));
    server.use(express.static(server.set('app root') + '/public'));
    server.use(express.cookieParser());
    server.use(express.session({
      secret: Math.uuidFast(),
      key: options.sessionKey,
      store: new express.session.MemoryStore({
        reapInterval: options.reapInterval,
        maxAge: options.maxAge
      })
    }))
    server.use(express.bodyParser())
    server.use(context);
    server.use(server.router)
    server.use(express.errorHandler({ dumpExceptions: options.dumpExceptions, showStack: options.showStack}));
    
    // Helpers
    
    require('./config/helpers')(server)
    
    // Map routes
    
    require('./config/routes')(server)

  })
  
  // Config (development)
  
  server.configure('development', function() {
    server.use(express.logger({ format: ':method :url :status' }));
  });
      
  // Config (staging)
  
  server.configure('staging', function() {
    server.use(express.logger({ format: ':method :url :status' }));
  });
      
  // Config (production)
  
  server.configure('production', function() {

  });
  
  // Handle errors
  
  require('./config/errors.js')(server)
    
  // Export the server
  
  return server;
  
})();
