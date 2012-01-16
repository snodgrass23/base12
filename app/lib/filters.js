var respond = require('./respond');

module.exports = {
  create: function(Model) {
    return function(req, res, next) {
      var instance = new Model(req.body);
      instance.attach(req.files);
      instance.save(next);
    };
  },
  update: function(m) {
    return function(req, res, next) {
      var model = req[m];
      model.set(req.body);
      model.attach(req.files);
      model.save(next);
    };
  },
  ajaxupload: function(Model) {
    return function(req, res, next) {
      var prop = req.query.ajaxupload;
      if (prop && req.files[prop]) {
        var AttachmentModel = Model[prop];
        if (AttachmentModel) {
          var attachment = new AttachmentModel(req.files[prop]);
          attachment.save(function (err, doc) {
            respond(err, req, res, doc);
          });
        }
      }
      else return next();
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
