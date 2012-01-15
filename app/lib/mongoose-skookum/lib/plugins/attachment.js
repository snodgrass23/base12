var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var async = require('async');
var imagemagick = require('imagemagick');

var AttachmentSchema = new mongoose.Schema({
  path: String,
  name: String,
  filetype: String,
  size: Number,
  url: String
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
    console.log("ATTACHING:", files);
    for (var prop in files) {
      if (files[prop].size > 0) pending_attachments.push({ prop: prop, file: files[prop], options: options[prop] });
    }
  };

  // Check for pending attachments before saving
  schema.pre('save', function(next) {
    var self = this;
    console.log("SAVE with pending attachments:", pending_attachments);
    async.forEach(pending_attachments,
      function(attachment, callback) {
        process_pending.call(self, attachment, callback);
      },
      function(err) {
        pending_attachments = [];
        if (err) return next(new Error(err));
        else return next();   // TODO: figure out why return next(err) doesn't work by itself
      }
    );
  });

  // Process and attach a file
  function process_pending(attachment, callback) {
    var self = this;
    async.forEachSeries([ options[key].before, move, store, options[key].after ],
      function(fn, callback) {
        if (fn) return fn.call(self, attachment, callback);
        else return callback();
      }, callback);
  }

  // Move newly uploaded files
  function move(src, callback) {
    console.log("MOVE process on:", src);
    var ext = path.extname(src.file.name);
    var filename = path.basename(src.file.path);
    src.destination = src.options.dest + '/' + filename + ext;
    src.url = '/uploads/' + filename + ext; // TODO: don't hardcode this
    fs.rename(src.file.path, src.destination, callback);
  }

  // Store new files in the db as AttachmentModels
  function store(src, callback) {
    console.log("STORING file in db");
    var self = this;
    console.log("THIS = ", this);
    var new_attachment = new AttachmentModels[src.prop]({
      path: src.destination,
      name: src.file.name,
      filetype: src.file.type,
      size: src.file.size,
      url: src.url
    });
    new_attachment.save(function(err, doc) {
      if (doc) self[src.prop] = doc._id;        // Link to dbref
      return callback(err);
    });
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