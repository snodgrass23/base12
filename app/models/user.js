var mongoose = require('mongoose');

var util = require('../../lib/mongoose-util');
var file = require('../../lib/mongoose-file');

module.exports = function(server, config) {

  /**
   * User model to interact with users collection in mongo using the Mongoose ORM
   *
   * @author Jim Snodgrass <jim@skookum.com>
   */

  var User = new mongoose.Schema({
    email     : { type: String, index: true, required: true, lowercase: true, trim: true, unique: true, validate: [util.validate.email, 'not valid'] },
    name      : { type: String, trim: true, required: true },
    about     : { type: String, trim: true },
    docs      : [{ type: mongoose.Schema.ObjectId, ref: 'UserDoc' }]
  }, {strict: true});

  // Plugins

  User.plugin(util.plugin.password, { required: true });
  User.plugin(util.plugin.timestamps);
  User.plugin(file.plugin, {
    photo: {
      dest: server.set('uploads'),
      prefix: server.set('uploads url'),
      before: file.image({ width: 220, height: 220})
    },
    cv: {
      dest: server.set('uploads'),
      prefix: server.set('uploads url'),
      before: file.whitelist(['.pdf', '.doc', '.txt', '.docx'])
    }
  });

  // Export

  return mongoose.model('User', User);

};