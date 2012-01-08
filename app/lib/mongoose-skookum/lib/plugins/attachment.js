var fs = require('fs');
var path = require('path');

var attachment_props = {
  path      : { type: String }, // Path to the saved file, including filename
  filename  : { type: String }, // Original filename of upload
  filetype  : { type: String }, // MIME type
  size      : { type: Number }  // Filesize
};

var handlers = {
  'default': function(file, options, callback) {
    console.log("Handling FILE:", file);
    var filename = path.basename(file.path);
    var extension = path.extname(file.filename);
    var save_path = server.set('uploads') + '/' + filename + extension;
  
    console.log(file.path + ' --> ' + save_path);

    function complete(err) {
      if (err) console.error(err);
      fs.unlink(file.path);
      callback(err);
    }

    fs.rename(file.path, save_path, complete);
  },
  'image': function(file, options, callback) {
    //if (!_(['.jpg', '.jpeg', '.png', '.gif']).include(extension)) return callback('Unsupported filetype');
  }
};

module.exports = function AttachmentPlugin (schema, options) {
  options = options || {};
  options.property = options.property || false;
  options.handler = options.handler || 'default';
  options.schema = schema;

  schema.add(attachment_props, options.property + '.');

  schema.pre('save', function(next) {
    var is_modified;

    if (options.property) {
      is_modified = this.isModified(options.property);
    }
    else {
      is_modified = !!Object.keys(this._activePaths.states.modify).length;
    }

    console.log("IS MODIFIED? ", is_modified);
    if (is_modified) {
      var file_handler = handlers[options.handler];
      var file_data = options.property ? this.toObject()[options.property] : this.toObject();

      file_handler(file_data, options, function(err, res) {
        return next(err);
      });
    }
    else return next();
  });
};