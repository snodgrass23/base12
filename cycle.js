var base12 = require('base12');

base12.balance(__dirname + '/app', process.argv[2]);

// setup reloader on file change
// this will kill process whenever a file is changed allowing cluster to fork a replacement
require('./lib/reload')({
  dir:__dirname+'/app',
  ignore: ['public']
});