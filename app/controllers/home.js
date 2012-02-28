var filters = require('../../lib/filters');

module.exports = function(server, config) {

  return {
    
    // Landing page
    index: [
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
