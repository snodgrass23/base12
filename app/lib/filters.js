var respond = require('./respond');

module.exports = {
  create: function(Model, prop) {
    prop = prop || 'body';
    return function(req, res, next) {
      var instance = new Model(req[prop]);
      req.docs = req.docs || {};
      instance.attach(req.files);
      instance.save(function(err, doc) {
        if (doc) {
          req.docs[prop] = doc;
        }
        return next(err);
      });
    };
  },
  create_file: function(Model, prop) {
    return function(req, res, next) {
      console.log('MODELS.USER.PHOTO=', models.user.photo);
      console.log("create_file");
      req.docs = req.docs || {};
      console.log('req.files:', req.files);
      if (req.files && req.files[prop]) {
        console.log("ready with ", req.files[prop]);
        var instance = new Model(req.files[prop]);
        instance.save(function(err, doc) {
          if (doc) {
            req.docs[prop] = doc;
          }
          return next(err);
        });
      }
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
