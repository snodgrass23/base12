var redis = require('redis');

module.exports = function(app) {
  redis.debug_mode = app.config.redis_debug;

  var client = redis.createClient(app.config.redis_port, app.config.redis_host); 
  client.auth(app.config.redis_pass);
  client.select(app.config.redis_db);
  app.redis = client;
};