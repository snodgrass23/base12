/**
 * Home Controller
 *
 * @author David Becher <david@skookum.com>
 */
 
exports = module.exports = {

  /**
   * Render the landing page
   *
   */
  index: function(req, res, next) {
    res.render('home/index');
  },

  'new': [
    function(req, res, next) {
      console.log("New 1");
      next();
    },
    function(req, res, next) {
      console.log("New 2");
      res.send("new 2");
    }
  ],
  
  error: function(req, res, next) {
    res.render('home/error', { status: 400, error: "Error", message: res.error || "Something happened!" });
  }
  
};
