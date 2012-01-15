module.exports = {
  update: function(model) {
    return function(req, res, next) {
      req[model].set(req.body);
      req[model].attach(req.files);
      req[model].save(next);
    };
  },
  require_user: function(req, res, next) {
    if (req.currentUser) return next();
    res.redirect(server._locals.route('login'));
  },
  require_self: function(req, res, next) {
    var target_user = req.param('user');
    var active_user = req.currentUser ? req.currentUser._id + '' : undefined;
    if ((target_user && active_user) && (target_user === active_user)) {
      return next();
    }
    return next(new Error('Not authorized'));
  },
  require_not_user: function(req, res, next) {
    if (!req.currentUser) return next();
    return res.redirect(server.dynamicViewHelpers.account_route(req));
  },
  is_user: function(req, res, next) {
    if (req.currentUser) req.is_user = true;
    return next();
  },
  is_self: function(req, res, next) {
    var target_user = req.param('user');
    var active_user = req.currentUser ? req.currentUser._id + '' : undefined;
    if ((target_user && active_user) && (target_user === active_user)) {
      req.is_self = true;
    }
    else req.is_self = false;
    return next();
  }
};
