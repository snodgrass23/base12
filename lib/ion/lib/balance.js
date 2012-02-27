var cluster = require('cluster');
var os = require('os');

module.exports = function(app, fork_callback, death_callback) {
  
  // Figure out how many workers to start
  var env = process.env.NODE_ENV || 'development';
  var num_workers = process.argv[2] || (env === 'development') ? 1 : os.cpus().length;

  // Fork a new worker process
  function fork() {
    var f = cluster.fork();
    if (fork_callback) fork_callback(f);
  }

  // Start the server
  if (cluster.isMaster) {

    // Monitor all workers
    cluster.on('death', function(worker) {
      console.warn('Worker ' + worker.pid + ' died, forking a replacement...');
      if (death_callback) death_callback(worker);
      fork();
    });

    // Fork initial workers
    var workers = num_workers;
    while(workers--) { fork(); }
  }
  else {
    app.listen();
  }
};
