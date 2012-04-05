var local = require('../local');

module.exports = function(options) {
  console.log("OPTIONS:", options);
  return {

    keys: function(callback) {
      local(__dirname, '/keys.sh', options, callback);     
    },

    setup: function(callback) {
      console.log("Setup for joyent on", host);
      return callback();
    },

    user: function(callback) {
      remote(__dirname, '/user.sh', options, callback);
    }  
  };
};