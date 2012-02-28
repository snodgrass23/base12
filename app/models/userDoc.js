var mongoose = require('mongoose');

var util = require('../../lib/mongoose-util');
var file = require('../../lib/mongoose-file');

module.exports = function(server, config) {

  var UserDoc = new mongoose.Schema({
    
  }, {strict: true});

  UserDoc.plugin(util.plugin.timestamps);
  UserDoc.plugin(file.plugin, {
    file: {
      dest: server.set('uploads'),
      prefix: server.set('uploads url'),
      before: file.whitelist(['.pdf', '.doc', '.txt', '.docx'])
    }
  });

  return mongoose.model('UserDoc', UserDoc);
};