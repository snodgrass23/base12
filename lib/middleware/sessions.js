var session = require('express-session');
var RedisStore = require('connect-redis')(session);

module.exports = function(app) {
  return session({
    secret: 'keyboard cat',
    store: new RedisStore({
      client: app.redis
    })
  });
};
