var respond = require('./respond');

module.exports = {
  create: function(Model, modelname) {

    return function(req, res, next) {
      var instance = new Model(req.body);
      req.results = req.results || {};
      if (req.files && instance.attach) instance.attach(req.files);
      instance.save(function(err, doc) {
        if (doc) req.results[modelname] = doc;
        return next(err);
      });
    };
  },
  update: function(modelname) {

    return function(req, res, next) {
      var model = req[modelname];
      model.set(req.body);
      if (req.files && model.attach) model.attach(req.files);
      model.save(next);
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
