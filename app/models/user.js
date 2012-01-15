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
User.plugin(skookum.plugins.attachment, {
  property: 'photo',
  ref: 'UserPhoto',
  root: '/tmp',       // TODO: Check that all files are in here
  before: skookum.plugins.attachment.image,
  width: 300
});

// Export

var UserModel = module.exports = server.mongoose.model('User', User);

console.log("CREATING USER");
var new_user = new UserModel({
  email: 'huntertestingattachments4@skookum.com',
  name: 'Hunter Loftis',
  password: 'password',
  photo: '/tmp/12345'
});
new_user.save(function(err, doc) {
  console.log("err:", err);
  console.log("doc:", doc);
});

/*
// Will be saved like:


// Scenario 1: user fills out a form with his info + a file input, all in the same POST (vanilla):
var new_user2 = new models.user({
  email: 'hunter@skookum.com',
  photo: '/tmp/12345'
});

// Scenario 2: user uploads a photo first via form A (maybe an ajax upload) which returns the saved photo JSON,
// then saves his profile via form B which attaches the returned photo JSON to the POST.
var new_photo2 = new models.user.photo({ path: '/tmp/12345' });
new_photo2.save();
// ...
new_user.set({
  name: 'Hunter Loftis',
  photo: req.body.photo
});
new_user.save();

// Scenario 3: user uploads a photo first via form A which returns the saved _id,
// then saves his profile via form B which attaches the returned photo _id to the POST
var new_photo3 = models.user.photo({ path: '/tmp/12345' });
new_photo3.save();
// ...
new_user.set({
  photo: photo_id
});
new_user.save();

// Scenario 4: system provides user with a default photo by searching for the currently active default,
// then attaches it via its ObjectId
models.user.photo.find({ 'default': true }, function(err, default_photo) {
  new_user.set({
    photo: default_photo
  });
  new_user.save();
});

// Will be read like:

models.user.find(match).populate('photo').run(function(err, users) {
  
});
*/