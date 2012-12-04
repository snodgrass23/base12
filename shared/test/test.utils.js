module.exports = {
  startApp: function(port) {
    var config = process.env;
    var app = require('../../app')(config);
    var server = app.listen(port);
    return app;
  },
  clearRequireCache: function() {
    Object.keys(require.cache).forEach(function(key) {
      delete require.cache[key];
    });
  }
};
