var async = require('async');

var exec = require('child_process').exec;

var Shell = require('../shell');

var shell = new Shell();

module.exports = function(options) {

  console.log("Be sure to ssh to root@" + options.host + " at least once to enable remote access.");

  options.constants.name = 'node';
  //console.log("OPTIONS:", options);
  return {

    keys: function(callback) {
      console.log("Use the Joyent Web Admin tool to add user keys!");
      return callback();
    },

    user: function(callback) {
      console.log("The Joyent default node.js user is 'node'");
      return callback();
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
        }
      };
      var to_install = ['system'].concat(options.stack.install);
      console.log("Installing stack software:", to_install);
      console.log("(This could take several minutes)");
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
      console.log("The Joyent node.js stack already configures a node.js service!");
      return callback();
    },

    remote: function(callback) {
      shell.local(__dirname, '/remote.sh', options, callback);
    }

  };
};