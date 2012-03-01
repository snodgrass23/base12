module.exports = function(app) {

  console.log("REQUIRE NOT USER:", app.middleware.require_not_user);

  return {
    
    // Landing page
    index: [
      app.middleware.user.require_not_user,
      function(req, res, next) {
        res.render('home/index');
      }
    ],
    
    error: function(req, res, next) {
      res.render('home/error', { status: 400, error: "Error", message: res.error || "Something happened!" });
    }
  };

};
