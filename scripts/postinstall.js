#!/usr/bin/env node

var path = require('path'),
    fs = require('fs'),
    util = require('util');

var src = __dirname + '/../env/default.env.json',
    dst = __dirname + '/../.env.json';

path.exists(dst, function(exists) {
  if (exists) {
    console.log('Environment config (.env.js) found.');
  }
  else {
    console.log('Environment config (.env.js) not found, copying from env/default.env.js...');
    var rs = fs.createReadStream(src);
    var ws = fs.createWriteStream(dst);
    util.pump(rs, ws, function(err, result) {
      if (err) throw err;
      console.log('done.');
    });
  }
});