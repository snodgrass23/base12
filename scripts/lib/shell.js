var async = require('async');
var handlebars = require('handlebars');
var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

function Shell() {
  this.tmpfile = undefined;
}

Shell.prototype = {
  template: function(dir, script, data) {
    var script = fs.readFileSync(dir + script, 'utf-8');
    var template = handlebars.compile(script);
    var runnable = template(data);
    this.tmpfile = dir + '/tmpscript';
    fs.writeFileSync(this.tmpfile, runnable, 'utf-8');
    fs.chmodSync(this.tmpfile, '755');
  },
  destroy: function() {
    if (this.tmpfile) fs.unlinkSync(this.tmpfile);
  },
  remote: function(user, host, dir, script, data, callback) {
    this.template(dir, script, data);
    var cmd = 'ssh ' + user + '@' + host + " 'bash -s' < " + this.tmpfile;
    var self = this;
    console.log("EXECUTING:", cmd);
    /*
    var ssh = spawn('ssh', [user + '@' + host, "'bash", "-s'", '<', this.tmpfile]);
    ssh.stdout.on('data', function (data) {
      console.log('' + data);
    });
    ssh.stderr.on('data', function (data) {
      console.log('ERR:' + data);
    });
    ssh.on('exit', function(err, result) {
      //self.destroy();
      return callback(err);
    });
*/
    exec(cmd, function(err, stdout, stderr) {
      console.log(stdout);
      console.warn("Errors:\n", stderr);
      //self.destroy();
      return callback(err);
    });
  },
  local: function(dir, script, data, callback) {
    this.template(dir, script, data);
    var tmpscript = spawn(this.tmpfile);
    var self = this;
    process.stdin.resume();
    process.stdin.on('data', function(chunk) {
      tmpscript.stdin.write(chunk);
    });
    tmpscript.stdout.on('data', function (data) {
      console.log('' + data);
    });
    tmpscript.stderr.on('data', function (data) {
      console.log('ERR:' + data);
    });
    tmpscript.on('exit', function(err, result) {
      process.stdin.pause();
      self.destroy();
      return callback(err);
    });
  }
};

module.exports = Shell;