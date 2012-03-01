var mongoose = require('mongoose');

var util = require('../../lib/mongoose-util');
var file = require('../../lib/mongoose-file');

module.exports = function(app) {

  var UserDoc = new mongoose.Schema({
    
  }, {strict: true});

  UserDoc.plugin(util.plugin.timestamps);
  UserDoc.plugin(file.plugin, {
    file: {
      dest: app.config.uploads,
      prefix: app.config.uploads_url,
      before: file.whitelist(['.pdf', '.doc', '.txt', '.docx'])
    }
  });

  return mongoose.model('UserDoc', UserDoc);
};