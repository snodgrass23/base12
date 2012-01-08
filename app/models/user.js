var skookum = require('../lib/mongoose-skookum');

/**
 * User model to interact with users collection in mongo using the Mongoose ORM
 *
 * @author Jim Snodgrass <jim@skookum.com>
 */

var User = new server.mongoose.Schema({
  email     : { type: String, index: true, required: true, lowercase: true, trim: true, unique: true, validate: [skookum.validators.email, 'not valid'] },
  name      : { type: String, trim: true, required: true },
  about     : { type: String, trim: true }
}, {strict: true});

// Plugins

User.plugin(skookum.plugins.password, { required: true });
User.plugin(skookum.plugins.timestamps);
User.plugin(skookum.plugins.crud);

// Export

module.exports = server.mongoose.model('User', User);


