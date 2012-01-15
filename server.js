// initialize app including globals (server, options, etc)

var env = process.env.NODE_ENV || 'development';

var start_options = {
  watched_files: undefined,
  default_start_type: 'normal'
};

var start = {
  normal: function() {
    var cluster = require('cluster'),
        numCPUs = require('os').cpus().length,
        num_workers = env == 'development' ? 1 : numCPUs;

    if (cluster.isMaster) {
      // Fork workers.

      for (var i = 0; i < num_workers; i++) {
        var worker = cluster.fork();
      }

      cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
        cluster.fork();
      });
    }

    else {
      require('./app/app');
      server.listen(options.port);
      console.log("************\n"+options.appname+" worker listening at: "  + options.host + ' on port ' + options.port + "\n************");
    }
  },
  single: function() {
    require('./app/app');
    server.listen(options.port);
    console.log("************\n"+options.appname+" worker listening at: "  + options.host + ' on port ' + options.port + "\n************");
  },
  simple: function() {
    require('./app/app');
    server.listen(options.port);
    console.log("************\n"+options.appname+" worker listening at: "  + options.host + ' on port ' + options.port + "\n************");
  }
};

var start_type = process.argv[2] || start_options.default_start_type;
console.log("Starting in mode '" + start_type + "'...");


start[start_type]();