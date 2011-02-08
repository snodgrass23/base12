
// Application root - where to start building require() paths

var root = __dirname + '/../..'

require.paths.unshift(
  root + '/app',
  root + '/',
  root + '/lib',
  root + '/node_modules'
)

// Modules

var express = require('express')

require('math.uuid')

// Options

var TWO_WEEKS = 14 * 24 * 60 * 60 * 1000

var option_tables = {
  development: {
    forceCompile: true,
    reapInterval: TWO_WEEKS,
    maxAge: TWO_WEEKS,
    reqTimeout: 10000,
    sessionKey: 'devsession'
  },
  staging: {
    forceCompile: false,
    reapInterval: TWO_WEEKS,
    maxAge: TWO_WEEKS,
    reqTimeout: 10000,
    sessionKey: 'stagingsession'
  },
  production: {
    forceCompile: false,
    reapInterval: TWO_WEEKS,
    maxAge: TWO_WEEKS,
    reqTimeout: 10000,
    sessionKey: 'prodsession'
  }
}

// Server export

exports = module.exports = function() {
  
  var server = express.createServer(),
      options = option_tables[server.set('env')]

  // Config (all)
  
  server.configure(function() {
    
    // Settings
    
    server.set('app root', root + '/app')
    server.set('view engine', options.view_engine || 'jade')
    server.set('views', server.set('app root') + '/views')
    
    // Middleware
    
    //server.use(connectTimeout({ time: options.reqTimeout }))
    server.use(express.conditionalGet())
    server.use(express.compiler({ src: server.set('app root') + '/public', enable: ['less'], forceCompile: options.forceCompile || false }))
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
    
    // Helpers
    
    require('./helpers')(server)

    // Resourceful routing
    
    require('resourceful')(server)
    
    // Map routes
    
    require('./routes')(server)

  })
  
  // Config (development)
  
  server.configure('development', function() {
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true}))
    server.use(express.logger({ format: ':method :url :status' }));
    server.set('port', 100)
    server.set('host', 'http://localhost:100')
  })
      
  // Config (staging)
  
  server.configure('staging', function() {
    server.use(express.errorHandler({ dumpExceptions: true, showStack: false}))
    server.use(express.logger({ format: ':method :url :status' }));
    server.set('port', 100)
    server.set('host', 'http://staging.maximum.com')
  })
      
  // Config (production)
  
  server.configure('production', function() {

  })
  
  // Handle uncaught exceptions (no crashing)

  process.on("uncaughtException", function(err){
    console.warn("caught unhandled exception:")
    console.warn(err.stack || err)
  })
  
  // Respond to standard request errors
  
  server.error(function(err, req, res, next){
    if (!err || 2 !== err.errno)
      return res.render("500.jade", { layout: "layout.error.jade" }, function(err, content){
        res.send(content || "Internal Server Error", 500)  
      })
    
    res.render("404.jade", { layout: "layout.error.jade" }, function(err, content){
      res.send(content || "File Not Found", 404)  
    })
  })
  
  return server   // Export the server
}