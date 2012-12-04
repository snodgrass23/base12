module.exports = function(app) {

  return function log(req, res, next) {
    if (app.config.log_requests) {
      console.log(req.method + ' ' + req.url);
    }
    return next();
  };
};