var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var async = require('async');

var FileProperties = {
  url: String,
  path: String,
  name: String,
  mime: String,
  size: Number
};

var PENDING_PROP = '_pending_attachments';

module.exports = function FilePlugin(schema, options) {

  // Create an array that can be manipulated via array methods in schema.methods.attach()
  // but that cannot be overwritten by malicious client requests like UPDATE {_pending_files: ['/etc/passwd']}
  // TODO: is there a hook to insert this object just when a model is created? Does pre-init run every time or just when loading from DB, and not on new Model(...)?
  function ensurePendingOn(obj) {
    if (obj.hasOwnProperty(PENDING_PROP)) return;
    Object.defineProperty(obj, PENDING_PROP, {
      value: [],
      writable: false,
      enumerable: false
    });
  }

  // Add properties to the schema to track file information
  for (var property in options) {
    schema.add(FileProperties, property + '.');
  }

  // Create a schema method to mark newly uploaded files for processing on 'save'
  schema.methods.attach = function(files) {
    ensurePendingOn(this);
    console.log("ATTACHING:", files);
    for (var prop in files) {
      if (files[prop].size > 0) {
        this[PENDING_PROP].push({ prop: prop, file: files[prop], options: options[prop] });
      }
    }
  };

  // Check for pending attachments before saving
  schema.pre('save', function(next) {
    var self = this;
    var pending_attachments = this[PENDING_PROP];
    console.log("SAVE with pending attachments:", pending_attachments);
    async.whilst(
      function filesRemain() {
        return panding_attachments.length;
      },
      function processNextFile(callback) {
        process_pending.call(self, pending_attachments, callback);
      },
      function complete(err) {
        while(pending_attachments.length) panding_attachments.shift();  // Can't just set =[] because the property is not writeable
        if (err) return next(new Error(err));
        else return next();   // TODO: figure out why return next(err) doesn't work by itself
      }
    );
  });

  // Process and attach a file
  function process_pending(property, attachments, callback) {
    var self = this;
    var attachment = attachments.shift();
    async.forEachSeries([ options[key].before, move, store, options[key].after ],
      function(fn, callback) {
        if (fn) return fn.call(self, attachment.prop, attachment.file, callback);
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
};