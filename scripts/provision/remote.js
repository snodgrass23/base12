var exec = require('child_process').exec;

function Remote(host, user) {
  this.host = host;
  this.user = user;
  this.url = user + '@' + host;
}

Remote.prototype = {
  run: function(file, callback) {
    var cmd = 'ssh ' + this.url + " 'bash -s' < " + file;
    console.log("EXECUTING:", cmd);
    exec(cmd, function(err, stdout, stderr) {
      console.log("STDOUT:", stdout);
      console.warn("STDERR:", stderr);
      return callback(err);
    });
  }
}

module.exports = Remote;