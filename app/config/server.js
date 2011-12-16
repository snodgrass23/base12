// Establish a working directory

var root = require('path').normalize(__dirname + '/../..');

// Server setup

exports = module.exports = function() {
  
  server.set('root', root);
  server.set('app root', root + '/app');
  server.set('logs', root + '/logs');
  server.set('view engine', options.view_engine || 'jade');
  server.set('view options', {layout: 'layouts/layout'});
  server.set('views', server.set('app root') + '/views');
  server.set('public', server.set('app root') + '/public');
  
  var redis = require('redis');
  server.redis = redis;
  server.redisClient = redis.createClient(options.redis.port, options.redis.host);
  server.redisPub = redis.createClient(options.redis.port, options.redis.host);
  server.redisSub = redis.createClient(options.redis.port, options.redis.host);
  
};