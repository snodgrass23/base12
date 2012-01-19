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
  }
};