module.exports = function(app) {
  return {
    
    // Landing
    
    index: [
      function(req, res, next) {
        req.flash("info", "Thanks for loading base12!");
        res.render('home/index');
      }]

  };
};
