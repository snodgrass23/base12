var express = require('express');
var load = require('./load');

function App(params) {
  this._be_disposable();

  this.config = require(params.dir + '/../.env.js');                  // Load the environment's config
  this.server = this._create_server(params.dir + '/helpers');   // Create the express server & helpers
  this.models = load(params.dir + '/models', [this]);                       // Load all models
  this.controllers = load(params.dir + '/controllers', [this]);             // Load all controllers
  this._init_views(params.dir + '/views', params.dir + '/public');  // Point the server to the views & static files

  if (params.global) global[params.global] = this;

  this._init_server(params.init);
}

App.prototype = {
  _be_disposable: function() {
    process.on("uncaughtException", function(err){
      console.warn("Exiting process due to uncaught exception!");
      console.warn(err.stack || err);
      process.exit();
    });
  },
  _create_server: function(dir) {
    var server = express.createServer();
    var helpers = require(dir);

    helpers(server, this.config);

    return server;
  },
  _init_views: function(view_dir, pub_dir) {
    this.server.set('view engine', this.config.view_engine);
    this.server.set('view options', this.config.view_options);
    this.server.set('views', view_dir);
    this.server.set('public', pub_dir);
  },
  _init_server: function(tasks) {
    var app = this;
    tasks.forEach(function(task) {
      task(app);
    });
  },
  log: function(str) {
    if (this.config.silent) return;
    console.log(str);
  },
  listen: function() {
    this.server.listen(this.config.port);
    this.log('[ ' + this.config.appname + " ] worker listening at: "  + this.config.host + ' on port ' + this.config.port + ' in ' + this.config.environment + ' environment.');
  }
};

module.exports = App;