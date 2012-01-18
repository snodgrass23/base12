var skookum = require('../lib/mongoose-skookum');

var UserPhoto = new server.mongoose.Schema({
  
}, {strict: true});

User.plugin(skookum.plugins.timestamps);
User.plugin(skookum.plugins.attachment, {
  dest: server.set('uploads'),
  before: skookum.plugins.attachments.image,
  width: 220,
  height: 220
});

module.exports = server.mongoose.model('UserPhoto', UserPhoto);