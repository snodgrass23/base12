var spawn = require('child_process').spawn;
var fs = require('fs');
var basename = require('path').basename;
var extname = require('path').extname;

var extensions = ['.js'];
var interval = 100;

var files = fs.readdirSync(__dirname);
files.forEach(traverse);

run();

var app;

function run() {
  app = spawn('node', ['run']);
  app.once('exit', function() {
    setTimeout(function() {
      run();
    }, 500);
  });
}

function kill() {
  app.kill('SIGTERM');
}

// traverse file if it is a directory
// otherwise setup the watcher
function traverse(file) {
  fs.stat(file, function(err, stat){
    if (!err) {
      if (stat.isDirectory()) {
        if (~exports.ignoreDirectories.indexOf(basename(file))) return;
        fs.readdir(file, function(err, files){
          files.map(function(f){
            return file + '/' + f;
          }).forEach(traverse);
        });
      } else {
        watch(file);
      }
    }
    else {
      console.log("ERR Looking at file in reloader:", err);
    }
  });
}

// watch file for changes
function watch(file) {
  if (!~extensions.indexOf(extname(file))) return;
  fs.watchFile(file, { interval: interval }, function(curr, prev){
    if (curr.mtime > prev.mtime) {
      console.log('  \033[36mchanged\033[0m \033[90m- %s\033[0m', file);
      kill();
    }
  });
}

exports.ignoreDirectories = ['node_modules', 'support', 'test', 'bin', 'public', '.git'];