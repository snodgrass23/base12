var plugins = require('mongoose-skookum').plugins;

/**
 * User model to interact with users collection in mongo using the Mongoose ORM
 *
 * @author Jim Snodgrass <jim@skookum.com>
 */

// custom validators
var valid = {
  length: function (v) {
    return v && v.length > 3;
  },
  email: function (email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return email.match(re) !== null;
  }
};



var User = new server.mongoose.Schema({
  reg_ts    : Number,
  email     : { type: String, index: true, required:true, lowercase: true, trim:true, unique: true, validate: [valid.email, 'not valid'] },
  name      : { type: String, trim: true, required:true },
  about     : { type: String, trim: true },
  password  : { type: String, trim: true, required:true, validate: [valid.length, 'required to be at least 4 characters'] }
}, {strict: true});

// Plugins

User.plugin(plugins.timestamps);
User.plugin(plugins.crud);

// Getters and Setters

User.path('password').set(function(password) {
  var hashed = require('password-hash').generate(password, { algorithm: 'sha256', saltLength: 12 });
  if (valid.length(password)) return hashed;
  // pass short chars to fail length validation
  else return "f";
});

// Statics

User.statics.find_by_login = function(props, callback) {
  return this.findOne({ email: props.email }, function(err, user) {
    if(user && !err && require('password-hash').verify(props.password, user.password)) {
        return callback(undefined, user);
    }
    else {
      return callback('Unable to login');
    }
  });
};

// Export

var UserModel = server.mongoose.model('User', User);
module.exports = UserModel;


