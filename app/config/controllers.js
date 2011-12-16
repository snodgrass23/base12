// Controllers setup

var dir = server.set('app root') + '/controllers/',
    autoloader = require('../../lib/loader');

exports = module.exports = function() {
  autoloader.load(controllers, dir);  
};