var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var async = require('async');
var imagemagick = require('imagemagick');

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
    for (var prop in files) {
      pending_attachments.push({ prop: prop, file: files[prop], options: options[prop] });
    }
  };

  // Check for pending attachments before saving
  schema.pre('save', function(next) {
    async.whilst(
      function() { return pending_attachments.length > 0; },
      function(callback) { process_pending(pending_attachments, callback); },
      next
    );
  });

  // Process and attach a file
  function process_pending(attachments, callback) {
    var attachment = attachments.shift();
    async.forEachSeries([ options[key].before, move, store, options[key].after ],
      function(fn, callback) {
        if (fn) return fn(attachment, callback);
        else return callback();
      }, callback);
  }

  // Move newly uploaded files
  function move(src, callback) {
    console.log("MOVE process on:", src);
    var ext = path.extname(src.file.name);
    var filename = path.basename(src.file.path);
    src.destination = src.options.dest + '/' + filename + ext;
    fs.rename(src.file.path, src.destination, callback);
  }

  // Store new files in the db as AttachmentModels
  function store(src, callback) {
    console.log("STORING file in db");
    return callback();
  }
}

AttachmentPlugin.image = function(src, callback) {
  imagemagick.crop({
    srcPath: src.file.path,
    dstPath: src.file.path,
    width: src.options.width,
    height: src.options.height
  }, callback);
  function complete(err) {
    if (err) return callback(err);
    fs.unlink(src.file.path);
    return callback();
  }
};

module.exports = AttachmentPlugin;