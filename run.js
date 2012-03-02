var base12 = require('./lib/base12');
var app = require('./app');

base12.balance(app, process.argv[2]);
