module.exports = {
  is_user: function(req, res, next) {
    if (req.user) return next();
    console.log("not logged in, redirecting");
    res.redirect('/login');
  },
  is_not_user: function(req, res, next) {
    if (!req.user) return next();
    return res.redirect(server.dynamicViewHelpers.account_route(req));
  }
};
