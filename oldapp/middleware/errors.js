module.exports = function(app) {
  return {

    log: function(msg) {
      return function(req, res, next) {
        console.log(msg);
        return next();
      };
    },

    apologize: function(err, req, res, next) {
      req.flash('Sorry, something went wrong');
      res.redirect('/');
      console.log('ERROR:', err);
    }
  };
};