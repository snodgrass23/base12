exports = module.exports = {

  index: function(req, res, next) {
    res.status(200, 'info', 'This is a message');
    res.context({ message: "Hello, world!" }, 'home/index', req.param('format'));
  }
  
}