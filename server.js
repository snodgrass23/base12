var options = {
  port: 3100,
  watched_files: undefined,
  default_start_type: 'simple'
};

var cluster = require('cluster'),
    port    = 3100;

var start = {
  normal: function() {
    cluster('./app/app')
      .use(cluster.debug())
      .use(cluster.reload())
      .use(cluster.logger('logs', 'debug'))
      .use(cluster.stats())
      .use(cluster.pidfiles('pids'))
      .use(cluster.cli())
      .use(cluster.repl(8888))
      .listen(options.port);
  },
  single: function() {
    cluster('./app/app')
      .set('workers', 1)
      .set('respawn timeout', 500)
      .set('respawn limit', 3)
      .use(cluster.debug())
      .use(cluster.reload())
      .listen(options.port);
  },
  simple: function() {
    var app = require('./app/app');
    app.listen(options.port);
  }
};

function kill_zombies() {
  // remove any leftover sock files
  var exec = require('child_process').exec;
  exec("rm -f *.sock", function(err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);
  });
}

var start_type = process.argv[2] || options.default_start_type;
console.log("Starting in mode '" + start_type + "'...");

console.log("Killing zombies...");
kill_zombies();

console.log("Opening server on port " + options.port + "...");
start[start_type]();