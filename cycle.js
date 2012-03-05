var base12 = require('base12');

base12.cycle(__dirname + '/app', process.argv[2], {
  ignore: ['public']
});

