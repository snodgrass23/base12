module.exports = function Whitelist(whitelist_options) {
  return function(file, options, callback) {
    return callback();
  };
};
