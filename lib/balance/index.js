var cluster = require('cluster');
var os = require('os');

module.exports = function balance(init, max) {
  return cluster.isMaster? initMaster() : init();
};

function initMaster() {
  cluster.on('exit', function(worker) {
    cluster.fork();
  });

  cluster.on('death', function(worker) {
    cluster.fork();
  });

  var workerCount = process.argv[2] || os.cpus().length;
  var i = workerCount;
  while(i--) {
    cluster.fork();
  }
}