module.exports = {
  validators: require('./lib/validators'),
  plugins: {
    crud: require('./lib/plugins/crud'),
    timestamps: require('./lib/plugins/timestamps'),
    password: require('./lib/plugins/password')
  }
};