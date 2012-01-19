var cluster = require('cluster');
var os = require('os');
var app = require('./app/app');

// Figure out how many workers to start
var env = process.env.NODE_ENV || 'development';
var num_workers = (env === 'development') ? 1 : os.cpus().length;
if (process.argv[2]) num_workers = process.argv[2];

// initialize app including globals (server, options, etc)
function start() {
  if (cluster.isMaster) {

    // Monitor all workers
    cluster.on('death', function(worker) {
      console.warn('Worker ' + worker.pid + ' died, forking a replacement...');
      cluster.fork();
    });

    // Fork initial workers
    var workers = num_workers;
    while(workers--) { cluster.fork(); }
  }
  else {
    app.init();
    app.listen();
  }
}

// Let's DO IT LIVE
start();