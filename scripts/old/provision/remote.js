var exec = require('child_process').exec;

function Remote(host, user) {
  this.host = host;
  this.user = user;
  this.url = user + '@' + host;
}

Remote.prototype = {
  run: function(file, forward, callback) {
    if (arguments.length === 2) {
      callback = forward;
      forward = false;
    }
    var cmd = 'ssh ' + this.url + " 'bash -s' < " + file;
    console.log("EXECUTING:", cmd);
    exec(cmd, function(code, stdout, stderr) {
      console.log("CODE:", code)
      console.log("STDOUT:", stdout);
      console.warn("STDERR:", stderr);
      if (forward) return callback(code);
      return callback();
    });
  }
}

module.exports = Remote;