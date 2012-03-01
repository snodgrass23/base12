module.exports = function(app) {
  return {

    respond: function(err, req, res, next) {
      req.flash('Sorry, something went wrong');
      res.redirect('/');
      console.log('ERROR:', err);
    }
  };
};