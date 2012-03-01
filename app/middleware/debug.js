module.exports = function(app) {
  return {
    log: function(msg) {
      return function(req, res, next) {
        console.log(msg);
        return next();
      };
    }
  };
};