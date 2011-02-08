var home = require('controllers/home')

exports = module.exports = function(server) {

  server.map('all', '/', home.index)
  
}