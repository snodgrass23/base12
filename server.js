// initialize app including globals (server, options, etc)
require('./app/app');

var start_options = {
  watched_files: undefined,
  default_start_type: 'simple'
};

var start = {
  normal: function() {
    var cluster = require('cluster'),
        numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
      // Fork workers.
      for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
      });
    } 

    else {
      server.listen(options.port);
    }
  },
  single: function() {
    server.listen(options.port);
  },
  simple: function() {
    server.listen(options.port);
  }
};

var start_type = process.argv[2] || start_options.default_start_type;
console.log("Starting in mode '" + start_type + "'...");

console.log("************\n"+options.appname+" worker listening at: "  + options.host + ' on port ' + options.port + "\n************");
start[start_type]();