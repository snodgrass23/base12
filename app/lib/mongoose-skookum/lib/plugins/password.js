var hash = require('password-hash');

function oneway(clear) {
  return hash.generate(password, { algorithm: 'sha256', saltLength: 12 });
}

module.exports = function(schema, options) {
  
  options = options || {};
  options.length = options.length || 5;

  schema.add({ password: { type: String, trim: true, required: options.required }});

  schema.path('password').set(function(password) {
    if (password.length < options.length) return undefined;
    else return encrypt(password);
  });

  schema.methods.verify_password = function(password) {
    return hash.verify(password, this.password);
  };

  schema.statics.find_with_password = function(props, callback) {
    var password = props.password;
    delete props.password;
    return this.findOne(props, function(err, doc) {
      if(doc && !err && doc.verify_password(password)) {
        return callback(undefined, doc);
      }
      else {
        return callback();
      }
    });
  };


};