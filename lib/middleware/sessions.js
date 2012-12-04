var express = require('express');
var RedisStore = require('connect-redis')(express);

module.exports = function(app) {

  return express.session({
    store: new RedisStore({
      client: app.redis
    })
  });
};