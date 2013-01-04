var path = require('path');

module.exports = function(app, config) {

  app.use(function(req, res, next) {
    res.status(404);
    return res.render(path.join(__dirname, '404'));
  });

  app.use(function(err, req, res, next) {
    console.log('Caught an error in error middleware:', err.stack || err);
    res.status(404);
    return res.render(path.join(__dirname, '404'));
  });

  process.addListener('uncaughtException', function(err) {
    console.log('Uncaught exception!', err.stack);
    console.log('Exiting process');
    process.exit();
  });

};