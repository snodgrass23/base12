/**
 * User model to interact with users collection in mongo using the Mongoose ORM
 *
 * @author Jim Snodgrass <jim@skookum.com>
 */

var password_hash = require('password-hash');

var User = new server.mongoose.Schema({
  reg_ts    : Number,
  email     : { type: String, index: true, trim:true },
  name      : { type: String, trim: true },
  password  : { type: String, trim: true },
  created_at: { type: Date, 'default': Date.now },
  updated_at: { type: Date, 'default': Date.now }
});

// Getters and Setters

User.path('password').set(function(clear) {
  var hashed = password_hash.generate(clear, { algorithm: 'sha256', saltLength: 12 });
  return hashed;
});

// Methods

User.statics.speak = function() {
  console.log("Hello World!!");
};

var UserModel = server.mongoose.model('User', User);
module.exports = UserModel;




