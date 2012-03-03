/**
 * Loader
 * auto loads files as modules into an object
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');
var _ = require('underscore');

exports = module.exports = {

  load: loadFiles

};

function loadFiles(obj, dir, first){
  var files = fs.readdirSync(dir),
      num = 0;
  first = first || [];

  first = _(first).map(function(file) {
    return file + '.js';
  });

  files = _(files).reject(function(file) {
    return _(first).contains(file);
  });

  var order = first.concat(files);

  _(order).each(function(file) {
    stat = fs.statSync(dir+file);
    if (!stat.isDirectory() && path.extname(file) == '.js') {
      var name = path.basename(file, ".js");
      obj[name] = require(dir+name);
      num++;
    }
  });

  console.log("auto loaded "+num+" modules in: " + dir);
}