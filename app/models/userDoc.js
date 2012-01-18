var skookum = require('../lib/mongoose-skookum');
var file = require('../lib/mongoose-file');

var UserDoc = new server.mongoose.Schema({
  
}, {strict: true});

User.plugin(skookum.plugins.timestamps);
User.plugin(file.plugin, {
  file: {
    dest: server.set('uploads'),
    before: file.whitelist(['.pdf', '.doc', '.txt', '.docx'])
  }
});

module.exports = server.mongoose.model('UserDoc', UserDoc);