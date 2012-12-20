module.exports = function(app) {

  app.use(function(req, res, next) {
    req.flash = function(message) {
      var messages = req.session.messages || [];
      messages.push(message);
      req.session.messages = messages;
    };
    return next();
  });

  app.use(function(req, res, next) {
    res.locals.getMessages = function() {
      var messages = req.session.messages || [];
      req.session.messages = [];
      return messages;
    };
    return next();
  });
};