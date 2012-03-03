var express = require('express');
var load = require('./load');

function App(params) {
  this._be_disposable();

  this.dir = params.dir;
  this.config = require(params.dir + '/../.env.js');                  // Load the environment's config
  this.constants = params.constants;
  this.server = this._create_server();                          // Create the express server & locals (helpers)

  this._create_locals(params.dir + '/locals');

  this.models = load(params.dir + '/models', [this]);                       // Load all models
  this.middleware = load(params.dir + '/middleware', [this]);
  this.controllers = load(params.dir + '/controllers', [this]);             // Load all controllers

  this._init_views(params.dir + '/views', params.dir + '/public');  // Point the server to the views & static files
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
  _create_server: function() {
    var server = express();

    return server;
  },
  _create_locals: function(dir) {
    var locals = require(dir);
    var app = this;

    // Create local 'app' in all views
    this.server.locals.use(function(req, res) {
      res.locals.app = app;
    });

    // Create locals (view helpers)
    locals(this);
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