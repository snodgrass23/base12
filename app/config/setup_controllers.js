// Controllers setup

exports = module.exports = function() {
  
  var dir = '../controllers/';
  
  controllers.home      = require(dir+'home');
  controllers.users      = require(dir+'users');
  controllers.auth      = require(dir+'auth');
  
};