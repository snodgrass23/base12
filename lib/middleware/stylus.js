var express = require('express');
var stylus = require('stylus');
var path = require('path');
var nib = require('nib');

module.exports = function(app) {

  // Stylus
  function compile(str, path) {
    return stylus(str)
      .set('compress', app.config.stylus_compress)
      .set('filename', path)
      .use(nib())
      ['import']('nib');
  }

  var styles = stylus.middleware({
    src: path.join(__dirname, '../../shared'),
    dest: path.join(__dirname, '../../public'),
    debug: app.config.stylus_debug,
    compile: compile,
    force: app.config.stylus_force
  });

  return styles;
};