var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var async = require('async');

var AttachmentSchema = new mongoose.Schema({
  path: { type: String },
  filename: { type: String},
  filetype: { type: String },
  size: { type: Number }
}, {strict: true});

function AttachmentPlugin(schema, options) {

  // Track attachments that must be processed on save
  var pending_attachments = [];

  /**   For each attachment:
   *    - Create a new collection to store its file information
   *    - Create a dbref property on the schema to point to the new collection
   */
  var AttachmentModels = {};
  var properties = {};
  for (var key in options) {
    AttachmentModels[key] = mongoose.model(options[key].ref, AttachmentSchema);
    schema.methods[key] = AttachmentModels[key];
    properties[key] = { type: ObjectId, ref: options[key].ref };
  }
  schema.add(properties);

  // Create a schema method to mark newly uploaded files for processing on 'save'
  schema.methods.attach = function(files) {
    console.log("ATTACH:", files);
    for (var prop in files) {
      pending_attachments.push({ prop: prop, file: files[prop], options: options });
    }
  };

  // Check for pending attachments before saving
  schema.pre('save', function(next) {
    console.log("PRE-SAVE");
    async.forEach(pending_attachments, process_pending, next);
  });

  // Process and attach a file
  function process_pending(attachment, callback) {
    console.log("PROCESSING ATTACHMENT:", attachment);
    async.forEachSeries([ move, options[key].before, options[key].after, store ],
      function(fn, callback) {
        if (fn) return fn(attachment, callback);
        else return callback();
      }, callback);
  }

  // Move newly uploaded files
  function move(src, callback) {
    console.log("MOVE process on:", src);
    if (src.destination) {
      // move file from src.path to src.destination
      /*
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
    */
    }
    return callback();
  }

  // Store new files in the db as AttachmentModels
  function store(src, callback) {
    console.log("STORING file in db");
    return callback();
  }
}

AttachmentPlugin.image = function(src, callback) {
  console.log("IMAGE process");
  var filename = 'get_from_src.path' + '.jpg';
  src.destination = 'some_base' + '/uploads/' + filename;
  return callback();
};

module.exports = AttachmentPlugin;