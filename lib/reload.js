/*!
 * Cluster - reload
 * Branched from 2011 LearnBoost <dev@learnboost.com>
 * @author Jim Snodgrass <jim@skookum.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    basename = require('path').basename,
    extname = require('path').extname;

exports = module.exports = function(options){
  options = options || {};

  // defaults
  var interval = options.interval || 100,
      extensions = options.extensions || ['.js'],
      signal = options.signal || 'SIGQUIT';

  files = fs.readdirSync(server.set('root'));
  files.forEach(traverse);

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
        process.kill(process.pid, signal);
      }
    });
  }
};

/**
 * Directories to ignore.
 */

exports.ignoreDirectories = ['node_modules', 'support', 'test', 'bin', 'public', '.git'];
