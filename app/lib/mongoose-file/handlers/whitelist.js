module.exports = function Whitelist(options) {
  return function(property, file, callback) {
    return callback();
  };
};
