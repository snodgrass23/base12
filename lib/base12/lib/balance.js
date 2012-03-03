var cluster = require('cluster');
var os = require('os');

module.exports = function(app_path, max) {

  // Figure out how many workers to start
  var num_workers = parseInt(max, 10) || os.cpus().length;

  // Fork a new worker process
  function fork() {
    var f = cluster.fork();
    // Extend EventEmitter and emit 'fork'
  }

  // Start the server
  if (cluster.isMaster) {

    // Monitor all workers
    cluster.on('death', function(worker) {
      console.warn('Worker ' + worker.pid + ' died, forking a replacement...');
      // Extend EventEmitter and emit 'death'
      fork();
    });

    // Fork initial workers
    var workers = num_workers;
    while(workers--) { fork(); }
  }
  else {
    var app = require(app_path);
    app.start();
  }
};
