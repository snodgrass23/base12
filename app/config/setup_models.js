// Controllers setup

exports = module.exports = function() {
  
  // Connect to Database
  server.mongoose = require('mongoose');
  server.mongoose.connect(options.mongo.db, function(err) {
    if (err) throw new Error(err.message);
  });

  // Initialize models
  
  var dir = "../models/";
  
  models.user = require(dir+'user');
  
};