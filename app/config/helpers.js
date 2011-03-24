exports = module.exports = function(server) {
  server.dynamicHelpers({
    messages: require('express-messages')
  });
}