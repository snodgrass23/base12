var fs = require('fs');
var path = require('path');

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

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var AttachmentSchema = new mongoose.Schema({
  path: { type: String },
  filename: { type: String},
  filetype: { type: String },
  size: { type: Number }
}, {strict: true});

function AttachmentPlugin(schema, options) {

  // Create a new model (collection) to store these attachments
  mongoose.model(options.ref, AttachmentSchema);

  var property = options.property; // get: returns dbrefprop's value, set: updates dbrefprop/flagprop
  var flagprop = options.property + '_flag'; // flags new attachments for processing
  var dbrefprop = options.property + '_dbref'; // stores our attachment ObjectId (dbref), or null when we have no attachment

  var properties = {};
  properties[flagprop] = { type: String };
  properties[dbrefprop] = { type: ObjectId, ref: options.ref };

  // Add our properties to the schema
  schema.add(properties);

  // Intercept saves to check for new attachments to process
  schema.pre('save', function(next) {
    if (this[flagprop]) {
      console.log("I should be processing the image at " + this[flagprop]);
    }
    return next(new Error('Not saving to avoid users'));
  });

  console.log("Setting up virtuals on " + property);
  schema.virtual(property)
    .get(function() {
      console.log("virtual getter");
      // property always returns the dbref
      return this[dbrefprop];
    })
    .set(function(file) {
      console.log("SETTER:", file);
      // file = a path ('/tmp/1234') an Object ({ ... }) or an ObjectId (string or obj)
      if (file instanceof ObjectId) {
        // ObjectId
        // file already in the DB, must be attached to the '_property' dbref
        this[dbrefprop] = file;
        return this[flagprop] = null;
      }
      else if (typeof(file) === 'string') {
        // path or ObjectId string
        if (~file.indexOf('/')) {
          // path
          return this[flagprop] = file;
        }
        else if (file.length === '12') {
          // hexstring, mongoose will cast
          this[dbrefprop] = file;
          return this[flagprop] = null;
        }
      }
      else if (typeof(file) === 'object' && file._id) {
        // An object that has already been saved
        this[dbrefprop] = file._id;
        return this[flagprop] = null;
      }
    });
}

AttachmentPlugin.move = function(src, options, next) {
  if (src.destination) {
    // move file from src.path to src.destination
  }
};

AttachmentPlugin.image = function(src, options, next) {
  var filename = 'get_from_src.path' + '.jpg';
  src.destination = base + '/uploads/' + filename;
  return next();
};

module.exports = AttachmentPlugin;