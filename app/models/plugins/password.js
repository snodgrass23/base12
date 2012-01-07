var hash = require('password-hash');

function oneway(clear) {
  return hash.generate(password, { algorithm: 'sha256', saltLength: 12 });
}

module.exports = function(schema, options) {
  
  options = options || {};
  options.length = options.length || 5;

  schema.path('password').set(function(password) {
    if (password.length < options.length) return undefined;
    else return encrypt(password);
  });

};