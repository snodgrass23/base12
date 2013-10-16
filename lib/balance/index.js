var cluster = require('cluster');
var os = require('os');

module.exports = function balance(init, max) {
  return cluster.isMaster? initMaster() : init();
};

function initMaster() {

  cluster.on('disconnect', function(worker) {
    console.error('Cluster worker disconnect! Forking new worker.');
    cluster.fork();
  });

  var workerCount = process.argv[3] || os.cpus().length;
  var i = workerCount;
  while(i--) {
    cluster.fork();
  }
}