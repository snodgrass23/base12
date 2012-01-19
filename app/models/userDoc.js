var util = require('../lib/mongoose-util');
var file = require('../lib/mongoose-file');

var UserDoc = new server.mongoose.Schema({
  
}, {strict: true});

UserDoc.plugin(util.plugin.timestamps);
UserDoc.plugin(file.plugin, {
  file: {
    dest: server.set('uploads'),
    prefix: server.set('uploads url'),
    before: file.whitelist(['.pdf', '.doc', '.txt', '.docx'])
  }
});

module.exports = server.mongoose.model('UserDoc', UserDoc);