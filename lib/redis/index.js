var redis = require('redis');

module.exports = function(app) {
  redis.debug_mode = app.config.redis_debug;

  var client = redis.createClient(app.config.redis_port, app.config.redis_host); 
  client.auth(app.config.redis_pass);
  client.select(app.config.redis_db);
  app.redis = client;

  client.on("ready", function() {
    // console.log("Redis connected to: "+app.config.redis_host);
  });

  client.on("error", function() {
    console.log("Error: Redis could not connect to: "+app.config.redis_host);
  });
};