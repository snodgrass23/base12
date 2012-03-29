var async = require('async');
var Remote = require('../remote');

module.exports = function(ip, config, constants) {

  var remote = new Remote(ip, 'root');

  var packages = {

    mongodb: {
      check: function(callback) {
        return remote.run(__dirname + '/mongodb_check.sh', callback);
      },
      install: function(callback) {
        return remote.run(__dirname + '/mongodb_install.sh', callback);
      }
    },

    redis: {
      check: function(callback) {
        return remote.run(__dirname + '/redis_check.sh', callback);
      },
      install: function(callback) {
        return remote.run(__dirname + '/redis_install.sh', callback);
      }
    },

    node: {
      check: function(callback) {
        return remote.run(__dirname + '/node_check.sh', callback);
      },
      install: function(callback) {
        return remote.run(__dirname + '/node_install.sh', callback);
      }
    }
  };

  return {

    setup: function(callback) {
      console.log("Setting up for Joyent");
      console.log("Config is:", config);
      return remote.run(__dirname + '/setup.sh', callback);
    },

    user: function(callback) {
      console.log("Creating user:", constants.name);
      return callback();
    },

    keys: function(callback) {
      console.log("Adding public keys");
      return callback();
    },

    repo: function(callback) {
      console.log("Creating repository");
      return callback();
    },

    install: function(callback) {
      config.install.forEach(function(pkgname) {
        var installer = packages[pkgname];
        if (installer) {
          async.waterfall([
            function precheck(callback) {
              installer.check(callback);
            },
            function install(installed, callback) {
              if (!installed) installer.install(callback);
            },
            function postcheck(callback) {
              installer.check(callback);
            },
          ],
          function result(err, result) {
            console.log("err, result:", err, result);
            return callback(err);
          });
        }
        else {
          console.warn("No installer present for", pkgname);
          return callback(new Error('No installer'));
        }
      });
    }
  };
};