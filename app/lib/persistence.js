var mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connect(app.config.mongo.db, function(err) {
    if (err) throw new Error(err.message);
  });
};
