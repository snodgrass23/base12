var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var async = require('async');

var FileProperties = {
  url: String,
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
    options[property].property = property;      // Convenience
    schema.add(FileProperties, property + '.');
  }

  // Create a schema method to mark newly uploaded files for processing on 'save'
  schema.methods.attach = function(files) {
    ensurePendingOn(this);
    console.log("ATTACHING:", files);
    for (var prop in files) {
      if (files[prop].size > 0) {
        this[PENDING_PROP].push({
          file: files[prop],
          options: options[prop]
        });
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
        return pending_attachments && pending_attachments.length;
      },
      function processNextFile(callback) {
        process_next.call(self, pending_attachments, callback);
      },
      function complete(err) {
        while(pending_attachments && pending_attachments.length) pending_attachments.shift();  // Can't just set =[] because the property is not writeable
        if (err) return next(new Error(err));
        else return next();   // TODO: figure out why return next(err) doesn't work by itself
      }
    );
  });
};

// Process and attach a file
function process_next(attachments, callback) {
  var self = this;
  var attachment = attachments.shift(),
      file = attachment.file,
      options = attachment.options;

  async.forEachSeries([ options.before, move, store, options.after ],
    function(fn, callback) {
      if (fn) return fn.call(self, file, options, callback);
      else return callback();
    }, callback);
}

// Move newly uploaded files
function move(file, options, callback) {
  console.log("MOVE process on:", file);
  var ext = path.extname(file.name);
  var filename = path.basename(file.path);
  file.destination = options.dest + '/' + filename + ext;
  file.url = options.prefix + '/' + filename + ext; // TODO: don't hardcode this
  fs.rename(file.path, file.destination, callback);
}

// Store the file's data in the model
function store(file, options, callback) {
  console.log("STORING ==========");
  console.log("file:", file);
  console.log("options:", options);
  console.log("container model:", this);
  this[options.property] = {
    url: file.url,
    name: file.name,
    mime: file.type,
    size: file.size
  };
  return callback();
}