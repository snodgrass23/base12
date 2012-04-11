var async = require('async');
var exec = require('child_process').exec;

var Shell = require('../shell');

var shell = new Shell();

module.exports = {
  provision: provision
};

function section(name) {
  console.log('\n===== ' + name + ' =====');
}

function provision(options, callback) {
  // Weird quirk of Joyent servers
  console.log("Be sure to ssh to root@" + options.host + " at least once to enable remote access.");

  // Go with Joyent's grain
  options.constants.name = 'node';

  console.log("OPTIONS:", options);

  var actions = {

    // Stack: nodejs

    keys: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      console.log("Use the Joyent Web Admin tool to add user keys!");
      return callback();
    },

    user: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      console.log("The Joyent default node.js user is 'node'");
      return callback();
    },

    nodejs: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      console.log("Installing node.js v" + options.config.deployment.nodejs.version);
      return shell.remote('root', options.host, __dirname, '/nodejs.sh', options, callback);
    },

    environment: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      return shell.local(__dirname, '/environment.sh', options, callback);
    },

    service: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      console.log("The Joyent node.js stack already configures a node.js service!");
      return callback();
    },

    remote: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      if (!options.remote) {
        console.warn("no remote specified");
        return callback();
      }
      return shell.local(__dirname, '/remote.sh', options, callback);
    },

    cycle: function(callback) {
      if (!options.config.deployment.nodejs) return callback("not a node stack");
      return shell.remote('root', options.host, __dirname, '/cycle.sh', options, callback);
    },

    // Stack: mongodb

    mongodb: function(callback) {
      if (!options.config.deployment.mongodb) return callback("not a mongo stack");
      return shell.remote('root', options.host, __dirname, '/mongodb.sh', options, callback);
    },

    // Stack: riak

    riak: function(callback) {
      var riak = options.config.deployment.riak;
      if (!riak) return callback("not a riak stack");
      return shell.remote('root', options.host, __dirname, '/riak.sh', options, callback);
    }
  };

  // Execute all these actions
  console.log("actions:", actions);
  async.forEachSeries(Object.keys(actions), action, callback);

  function action(item, callback) {
    section(item);
    actions[item](function(err, result) {
      if (err) console.log(err);
      return callback();
    });
  }
}