var mongoose = require('mongoose');

module.exports = function(app, config) {
  // only connect once
  if (mongoose.connection.readyState !== 0) return;
  mongoose.connect(config.mongoose_url);
};