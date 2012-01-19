module.exports = {
  plugin: require('./plugin'),

  whitelist: require('./handlers/whitelist'),
  image: require('./handlers/image')
};