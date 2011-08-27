// remove any leftover sock files
var exec = require('child_process').exec;
exec("rm *.sock", function(err, stdout, stderr) {
  console.log(stderr);
  console.log(stdout);
});


var cluster = require('cluster'),
    port    = 3100;

console.log("Opening server on port " + port + "...");


cluster('./app/app')
  .use(cluster.debug())
  .use(cluster.reload())
  .use(cluster.logger('logs', 'debug'))
  .use(cluster.stats())
  .use(cluster.pidfiles('pids'))
  .use(cluster.cli())
  .use(cluster.repl(8888))
  .listen(port);