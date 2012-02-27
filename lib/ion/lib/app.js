var express = require('express');
var load = require('./load');

function App(dir) {
  this._be_disposable();

  this.config = this._load_config(dir);
  this.server = this._create_server();
  this.models = this._load_models();
  this.views = this._load_views();
  this.controllers = this._load_controllers();
  this.helpers = this._load_helpers();

  if (options.global) global[options.global] = this;
}

App.prototype = {
  _be_disposable: function() {
    process.on("uncaughtException", function(err){
      console.warn("Exiting process due to uncaught exception!");
      console.warn(err.stack || err);
      process.exit();
    });
  },
  _load_config: function(dir) {
    return {
      dir: dir
    };
  },
  _create_server: function() {
    var middleware = require(this.config.dir + '/middleware');
    var routes = require(this.config.dir + '/routes');
    var server = express.createServer();

    server.set('root', this.config.dir);
    server.set('view engine', this.config.view_engine || 'jade');
    server.set('view options', { layout: false });
    server.set('views', server.set('root') + '/app/views');
    server.set('public', server.set('app root') + '/app/public');

    middleware(server, this.config);
    routes(server, this.config);

    return server;
  },
  _load_models: function() {

  },
  _load_views: function() {

  },
  _load_controllers: function() {

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

/*
module.exports = {
  init: function() {

    // globals
    global.environment = process.env.NODE_ENV || 'development';
    global.options = Options([environment]);
    global.server = express.createServer();
    global.models = {};
    global.controllers = {};

    server.configure(function() {

      require('./config/server')();
      require('./config/middleware')();
      require('./config/models')();
      require('./config/controllers')();
      require('./config/authentication')();
      require('./config/helpers')();
      require('./config/routes')();
      require('./config/errors.js')();

      if (environment == 'development') {
        // server reload on file changes
        reload();
      }

    });

  },
  listen: function() {
    server.listen(options.port);
    console.log('[ ' + options.appname + " ] worker listening at: "  + options.host + ' on port ' + options.port + ' in ' + environment + ' environment.');
  }
};
*/