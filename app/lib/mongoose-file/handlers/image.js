var imagemagick = require('imagemagick');

module.exports = function Image(options) {
  return function(property, file, callback) {
    imagemagick.crop({
      srcPath: file.path,
      dstPath: file.path,
      width: options.width,
      height: options.height
    }, callback);
  };
};
