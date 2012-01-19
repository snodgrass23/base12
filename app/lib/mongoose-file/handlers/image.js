var imagemagick = require('imagemagick');

module.exports = function Image(image_options) {
  return function(file, options, callback) {
    imagemagick.crop({
      srcPath: file.path,
      dstPath: file.path,
      width: image_options.width,
      height: image_options.height
    }, callback);
  };
};
