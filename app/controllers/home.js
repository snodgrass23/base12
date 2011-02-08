exports = module.exports = {

  index: function(req, res, next, view) {
    view.render(null, 'home/index')
  }
  
}