module.exports = {
  validate: require('./validators'),
  plugin: {
    timestamps: require('./plugins/timestamps'),
    password: require('./plugins/password')
  }
};