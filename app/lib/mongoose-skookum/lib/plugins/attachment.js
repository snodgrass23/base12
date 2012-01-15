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

  var property = options.property; // get: returns dbref's value, set: updates dbref/flag
  var flag = options.property + '_flag'; // flags new attachments for processing
  var dbref = options.property + '_dbref'; // stores our attachment ObjectId (dbref), or null when we have no attachment

  var properties = {};
  properties[flag] = { type: String };
  properties[dbref] = { type: ObjectId, ref: options.ref };

  // Add our properties to the schema
  schema.add(properties);

  // Build our processing list
  var fns = [AttachmentPlugin.move];
  if (options.before) fns.unshift(options.before);
  if (options.after) fns.push(options.after);

  // Intercept saves to check for new attachments to process
  schema.pre('save', function(next) {
    var src, i = 0;
    function process_file(err) {
      if (err) return next(new Error(err));
      if (fns[i]) return fns[i++].apply(this, [src, options, process_file]);
      else return next(new Error('Wow that worked'));
    }
    if (this[flag]) {
      src = {
        path: this[flag]
      };
      this[flag] = '';
      return process_file();
    }
    else return next(new Error('Not saving to avoid users'));
  });

  schema
    .virtual(property)
    .get(function() {
      return this[dbref];
    })
    .set(function(file) {               // file = a path ('/tmp/1234') an Object ({ ... }) or an ObjectId (string or obj)
      console.log("SETTER:", file);
      if (file instanceof ObjectId) {   // ObjectId
        this[dbref] = file;
        return this[flag] = null;
      }
      else if (typeof(file) === 'string') {
        if (~file.indexOf('/')) {             // path
          return this[flag] = file;
        }
        else if (file.length === '12') {      // hexstring id
          this[dbref] = file;
          return this[flag] = null;
        }
      }
      else if (typeof(file) === 'object' && file._id) {   // A document that has already been saved
        this[dbref] = file._id;
        return this[flag] = null;
      }
    });
}

AttachmentPlugin.move = function(src, options, callback) {
  console.log("MOVE process");
  if (src.destination) {
    // move file from src.path to src.destination
  }
  return callback();
};

AttachmentPlugin.image = function(src, options, callback) {
  console.log("IMAGE process");
  var filename = 'get_from_src.path' + '.jpg';
  src.destination = 'some_base' + '/uploads/' + filename;
  return callback();
};

module.exports = AttachmentPlugin;