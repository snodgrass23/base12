module.exports = function(app) {

  var filters = require('../../lib/filters')(app);

  console.log("FILTER:", filters.require_not_user);

  return {
    
    // Landing page
    index: [
      function(req, res, next) {
        console.log("LANDING");
        return next();
      },
      filters.require_not_user,
      function(req, res, next) {
        res.render('home/index');
      }
    ],
    
    error: function(req, res, next) {
      res.render('home/error', { status: 400, error: "Error", message: res.error || "Something happened!" });
    }
  };

};
