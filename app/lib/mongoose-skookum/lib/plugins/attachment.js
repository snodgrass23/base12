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
  var AttachmentModel = mongoose.model(options.ref, AttachmentSchema);

  var property = options.property; // get: returns dbref's value, set: updates dbref/flag
  var flag = options.property + '_flag'; // flags new attachments for processing
  var dbref = options.property + '_dbref'; // stores our attachment ObjectId (dbref), or null when we have no attachment

  var properties = {};
  properties[flag] = {};
  properties[dbref] = { type: ObjectId, ref: options.ref };

  // Move newly uploaded files
  function move(src, options, callback) {
    console.log("MOVE process on:", src);
    if (src.destination) {
      // move file from src.path to src.destination
    }
    return callback();
  }

  // Store new files in the db as AttachmentModels
  function store(src, options, callback) {
    console.log("STORING file in db");
    return callback();
  }

  // Add our properties to the schema
  schema.add(properties);

  // Build our processing list
  var fns = (function(steps) {
    var ret = [];
    steps.forEach(function(step) { if (step) ret.push(step); });
    return ret;
  })([move, options.before, options.after, store]);

  if (!schema.methods.attach) schema.methods.attach = function(files) {
    files.forEach(function(file) {
      
    });
  };

  // Intercept saves to check for new attachments to process
  schema.pre('save', function(next) {
    var src, i = 0, self = this;
    function process_file(err) {
      if (err) return next(new Error(err));
      if (fns[i]) return fns[i++].apply(this, [src, options, process_file]);
      else return next(new Error('Wow that worked'));
    }
    if (this[flag]) {
      src = { path: this[flag].path, name: this[flag].name };
      this[flag] = {};
      return process_file();
    }
    else return next(new Error('Not saving to avoid users'));
  });

  // Define a virtual property to sniff sets and to passthrough the dbref
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
      else if (typeof(file) === 'string' && file.length === '12') { // hexstring id
        this[dbref] = file;
        return this[flag] = null;
      }
      else if (typeof(file) === 'object') {
        if (file._id) {
          this[dbref] = file._id;
          return this[flag] = null;
        }
        else if (file.path && file.name) {
          return this[flag] = file;
        }
      }
    });
}

AttachmentPlugin.image = function(src, options, callback) {
  console.log("IMAGE process");
  var filename = 'get_from_src.path' + '.jpg';
  src.destination = 'some_base' + '/uploads/' + filename;
  return callback();
};

module.exports = AttachmentPlugin;