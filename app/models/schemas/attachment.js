
var File = new server.mongoose.Schema({
  path      : { type: String },
  type      : { type: String },
  size      : { type: Number }
});

// Plugins

File.plugin(models.plugins.timestamps);
File.plugin(models.plugins.whitelist);

// setter

File.path('path').set(function(path) {
  var filename = require('path').basename(path);
  return '/uploads/'+filename;
});


module.exports = File;
