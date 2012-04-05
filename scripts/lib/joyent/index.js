var async = require('async');
var handlebars = require('handlebars');
var fs = require('fs');

var spawn = require('child_process').spawn;
var remote;

function local(dir, script, data, callback) {
  var script = fs.readFileSync(dir + script, 'utf-8');
  var template = handlebars.compile(script);
  var runnable = template(data);
  fs.writeFileSync(dir + '/tmpscript', runnable, 'utf-8');
  fs.chmodSync(dir + '/tmpscript', '755');
  var tmpscript = spawn(dir + '/tmpscript');
  process.stdin.resume();
  process.stdin.on('data', function(chunk) {
    tmpscript.stdin.write(chunk);
  });
  tmpscript.stdout.on('data', function (data) {
    console.log('' + data);
  });
  tmpscript.stderr.on('data', function (data) {
    console.log('ERR: ' + data);
  });
  tmpscript.on('exit', function(err, result) {
    process.stdin.pause();
    //fs.unlinkSync(dir + '/tmpscript');
    return callback(err);
  });
}

module.exports = function(options) {
  return {

    keys: function(callback) {
      local(__dirname, '/keys.sh', options, callback);     
    },

    setup: function(callback) {
      console.log("Setup for joyent on", host);
      return callback();
    },

    user: function(callback) {
      var user_script = handlebars.compile(require('./user.sh'));
      var runnable_script = user_script({
        config: config,
        constants: constants
      });
    }    
  };
};