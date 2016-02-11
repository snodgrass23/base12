var methodOverride  = require('method-override');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');
var path            = require('path');
var compression     = require('compression');
var serveStatic     = require('serve-static');
var session         = require('express-session');
var RedisStore      = require('connect-redis')(session);


module.exports = function(app) {

  // Settings
  app.set('view engine', 'jade');

  // Middleware
  app.use(require('./logger')(app));
  app.use(compression());
  app.use(require('./stylus')(app));
  app.use(serveStatic(path.join(__dirname, '../../public')));
  app.use(cookieParser());
  app.use(require('./sessions')(app));
  app.use(bodyParser());
  app.use(methodOverride());
};
