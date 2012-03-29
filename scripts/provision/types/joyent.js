var async = require('async');

var ssh = require('../ssh');

module.exports = function(ip, config, constants) {

  var remote = ssh(ip, 'root');

  var packages = {

    mongodb: {
      check: function(callback) {
        return callback(undefined, false);
      },
      install: function(callback) {
        remote([
          'curl -O http://wiki.joyent.com/download/attachments/1639170/mongodbnode.sh',
          'bash mongodbnode.sh 2.0.2',
          'source ~/.bashrc',
          'pfexec svcadm enable mongodb'
        ], callback);
      }
    },

    redis: {
      check: function(callback) {
        return callback(undefined, false);
      },
      install: function(callback) {
        remote([
          'pkgin -y install redis',
          'svcadm enable redis'
        ], callback);
      }
    },

    node: {
      check: function(callback) {
        return callback(undefined, false);
      },
      install: function(callback) {
        return callback();
      }
    }
  };

  return {

    setup: function(callback) {
      console.log("Setting up for Joyent");
      console.log("Config is:", config);
      remote(['pkgin -y update'], callback);
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
            function result(err, result) {
              console.log("err, result:", err, result);
            }
          ]);
        }
        else {
          console.warn("No installer present for", pkgname);
        }
      });
    }
  };
};