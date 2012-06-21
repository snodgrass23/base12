var async = require('async');
var Remote = require('../remote');

module.exports = function(ip, config, constants) {

  var remote = new Remote(ip, 'root');

  var packages = {

    mongodb: {
      check: function(callback) {
        return remote.run(__dirname + '/mongodb_check.sh', true, function(code) {
          return callback(undefined, code);
        });
      },
      install: function(callback) {
        return remote.run(__dirname + '/mongodb_install.sh', callback);
      }
    },

    redis: {
      check: function(callback) {
        return remote.run(__dirname + '/redis_check.sh', true, function(code) {
          return callback(undefined, code);
        });
      },
      install: function(callback) {
        return remote.run(__dirname + '/redis_install.sh', callback);
      }
    },

    node: {
      check: function(callback) {
        return remote.run(__dirname + '/node_check.sh', true, function(code) {
          return callback(undefined, code);
        });
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

      function install_one(installer, complete) {
        async.waterfall([
          function precheck(callback) {
            installer.check(function(err, installed) {
              if (installed) {
                console.log("Already installed");
                return callback(new Error('Already installed'));
              }
              return callback();
            });
          },
          function install(installed, callback) {
            return installer.install(callback);
          },
          function postcheck(callback) {
            return installer.check(callback);
          },
        ],
        function(err, result) {
          console.log("Result:", err);
          return complete();
        });
      }

      async.forEachSeries(config.install, function(pkgname, callback) {
        var installer = packages[pkgname];
        if (installer) {
          return install_one(installer, callback);
        }
        else {
          console.warn("No installer present for", pkgname);
          return callback(new Error('No installer'));
        }
      }, callback);

    }
  };
};