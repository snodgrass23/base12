console.log("FILTER:", controllers.filters);

/**
 * Actions
 */
exports = module.exports = {

  // Landing page
  index: [
    controllers.filters.is_not_user,
    function(req, res, next) {
      res.render('home/index');
    }
  ],
  
  error: function(req, res, next) {
    res.render('home/error', { status: 400, error: "Error", message: res.error || "Something happened!" });
  }
  
};
