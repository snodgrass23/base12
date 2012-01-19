var respond = require('../lib/express-respond');
var express = require('express');

exports = module.exports = function() {
  
  // Handle uncaught exceptions

  process.on("uncaughtException", function(err){
    console.warn("Exiting process due to uncaught exception!");
    console.warn(err.stack || err);
    process.exit();
  });
  
  // Log errors we send to users
  server.error(respond.log);
  
  // If a route throws an error, handle it by providing an error flash or an error JSON code
  server.error(respond.error);

  // Then bounce the user back to the previous page & flash the message (if not JSON/xhr)
  server.error(respond.bounce);
  
};