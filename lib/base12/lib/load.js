/**
 * Loader
 * auto loads files as modules into an object
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

module.exports = function(dir, args) {
  var obj = {},
      files = fs.readdirSync(dir),
      name, filepath, stat;
  console.log("Files:", files);
  files.forEach(function(file) {
    filepath = dir + '/' + file;
    console.log("Checking filepath:", filepath);
    stat = fs.statSync(filepath);
    if (!stat.isDirectory() && path.extname(file) === '.js') {
      name = path.basename(file, '.js');
      console.log("LOADING", file);
      var fn = require(dir + '/' + name);
      obj[name] = fn.apply(fn, args);
    }
  });
  return obj;
};
