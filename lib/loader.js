/**
 * Loader
 * auto loads files as modules into an object
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path');

exports = module.exports = {

  load: function(obj, dir) {
    loadFiles(obj, dir);
  }

};

function loadFiles(obj, dir){
  var files = fs.readdirSync(dir),
      num = 0;

  _(files).each(function(file) {
    stat = fs.statSync(dir+file);
    if (!stat.isDirectory() && path.extname(file) == '.js') {
      var name = path.basename(file, ".js");
      obj[name] = require(dir+name);
      num++;
    }
  });

  console.log("auto loaded "+num+" modules in: " + dir);
}