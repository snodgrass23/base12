exports = module.exports = {

  index: function(req, res, next) {
    res.status(500, 'error', 'Something broke');
    res.context({ message: "Hello, world!" }, 'home/index', req.param('format'));
  }
  
}