var redis = require('redis'),
    url = require('url');

module.exports = function(app) {

  var config = app.config.redis;

  // check for redis_togo env
  if (app.config.redistogo_url) {
    try {
      var redis_connection = url.parse(app.config.redistogo_url);
      config = {
        host: redis_connection.hostname,
        port: redis_connection.port,
        auth: redis_connection.auth
      };
    }
    catch(e) {
      // error pulling redis_togo params
      console.log('Error pulling redis_togo params from ENV', app.config.redistogo_url, e);
    }
  }

  redis.debug_mode = config.debug;

  var client = redis.createClient(config.port, config.host);
  if (config.auth) {
    var auth = (config.auth.indexOf(":") > 0) ? config.auth.split(":")[1] : config.auth;
    client.auth(auth);
  }
  if (config.db) client.select(config.db);
  app.redis = client;

  client.on("ready", function() {
    console.log("Redis connected to: redis://"+config.host+":"+config.port);
  });

  client.on("error", function() {
    console.log("Error: Redis could not connect to: redis://"+config.host+":"+config.port);
  });
};