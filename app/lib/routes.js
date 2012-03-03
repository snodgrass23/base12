//var resource = require('express-resource');

module.exports = function(app) {
  
  // Home
  //app.server.resource(app.controllers.home);

  app.server.get('/', app.controllers.home.index);

};