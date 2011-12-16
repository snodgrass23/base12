
var dir = server.set('app root') + '/models/',
    autoloader = require('../../lib/loader');

exports = module.exports = function() {
  
  // Connect to Database
  server.mongoose = require('mongoose');
  server.mongoose.connect(options.mongo.db, function(err) {
    if (err) throw new Error(err.message);
  });

  // setup base models container
  models = {
    plugins: {},
    schemas: {}
  };

  // plugins

  autoloader.load(models.plugins, dir+'plugins/');

  // schemas

  autoloader.load(models.schemas, dir+'schemas/');

  // data models

  autoloader.load(models, dir);

  // flash errors method

  models.flashErrors = function(err, req) {
    for (var e in err.errors) {
      var r = err.errors[e];
      req.flash('error', r.path +' is '+ r.type ); 
    }
  };  
};
