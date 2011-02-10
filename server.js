var server = require('./app/config/server')()

server.listen(server.set('port'), '0.0.0.0', function() {
  console.log("Server listening at " + server.set('host') + "...")
})