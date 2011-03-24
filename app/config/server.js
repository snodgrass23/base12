// Application root - where to start building require() paths

var root = __dirname + '/../..'

require.paths.unshift(
  root + '/app',
  root + '/',
  root + '/lib',
  root + '/node_modules'
)

// Modules

var express = require('express'),
    connectTimeout = require('connect-timeout');

require('math.uuid');

// Constants

var constants = require('constants')();

// Server export

exports = module.exports = function() {
  
  var server = express.createServer(),
      options = constants[server.set('env')];

  // Config (all)
  
  server.configure(function() {
    
    // Settings
    
    server.set('app root', root + '/app')
    server.set('view engine', options.view_engine || 'jade')
    server.set('views', server.set('app root') + '/views')
    server.set('port', options.port);
    server.set('host', options.host);
    
    // Middleware
    
    server.use(connectTimeout({ time: options.reqTimeout }))
    server.use(express.conditionalGet())
    server.use(express.compiler({ src: server.set('app root') + '/public' }));
    server.use(express.staticProvider(server.set('app root') + '/public'))
    server.use(express.cookieDecoder())
    server.use(express.session({
      secret: Math.uuidFast(),
      key: options.sessionKey,
      store: new express.session.MemoryStore({
        reapInterval: options.reapInterval,
        maxAge: options.maxAge
      })
    }))
    server.use(express.bodyDecoder())
    server.use(server.router)
    server.use(express.errorHandler({ dumpExceptions: options.dumpExceptions, showStack: options.showStack}))
    
    // Helpers
    
    require('./helpers')(server)
    
    // Map routes
    
    require('./routes')(server)

  })
  
  // Config (development)
  
  server.configure('development', function() {
    server.use(express.logger({ format: ':method :url :status' }));
    
  })
      
  // Config (staging)
  
  server.configure('staging', function() {
    server.use(express.logger({ format: ':method :url :status' }));
  })
      
  // Config (production)
  
  server.configure('production', function() {

  })
  
  // Handle errors
  
  require('./errors.js')(server)
    
  return server   // Export the server
}