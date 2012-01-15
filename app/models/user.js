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
User.plugin(skookum.plugins.attachments, {
  photo: {
    ref: 'UserPhoto',
    before: skookum.plugins.attachments.image,
    width: 220
  }
});

// Export

module.exports = server.mongoose.model('User', User);

/*
// Use cases:


// Scenario 1: user fills out a form with his info + a file input, all in the same POST (vanilla):

user = new models.user(req.body);
user.attach(req.files);
user.save();

// Scenario 2: user uploads a photo first via form A (maybe an ajax upload) which returns the saved photo JSON,
// then saves his profile via form B which attaches the returned photo _id to the POST.

photo = new models.user.photo(req.files.photo);
photo.save();

user.set(req.body); // req.body.photo = the _id from new_photo2
user.save();

*/