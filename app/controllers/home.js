var filters = require('../lib/filters');

/**
 * Actions
 */
exports = module.exports = {

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
