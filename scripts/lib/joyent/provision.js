var async = require('async');

var exec = require('child_process').exec;

var Shell = require('../shell');

var shell = new Shell();

module.exports = function(options) {
  options.constants.name = 'node';
  console.log("OPTIONS:", options);
  return {

    keys: function(callback) {
      shell.local(__dirname, '/keys.sh', options, callback);     
    },

    user: function(callback) {
      exec('awk \'FNR==1{print ""}1\' ' + options.dir + '/config/keys/*.pub', function(err, stdout, stderr) {
        if (!err) {
          options.allkeys = stdout;
          return shell.remote('root', options.host, __dirname, '/user.sh', options, callback);
        }
        else {
          return callback();
        }
      });      
    },

    install: function(callback) {
      var map = {
        'system': {
          user: 'root',
          script: '/system.sh'
        },
        'nodejs': {
          user: 'root',
          script: '/nodejs.sh'
        },
        'redis': {
          user: 'root',
          script: '/redis.sh'
        }
      };
      var to_install = ['system'].concat(options.stack.install);
      console.log("Installing stack software:", to_install);
      function installItem(item, callback) {
        console.log("Installing " + item + "...");
        var installer = map[item];
        if (installer) {
          return shell.remote(installer.user, options.host, __dirname, installer.script, options, callback);
        }
        return callback();
      }
      return async.forEachSeries(to_install, installItem, callback);
    },

    environment: function(callback) {
      shell.local(__dirname, '/environment.sh', options, callback);
    },

    service: function(callback) {
      shell.remote('root', options.host, __dirname, '/service.sh', options, callback);
    },

    remote: function(callback) {
      shell.local(__dirname, '/remote.sh', options, callback);
    }

  };
};