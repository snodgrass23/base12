var async = require('async');

module.exports = function CrudPlugin (schema, options) {

  options = options || {};

  schema.statics.create = function(props, callback) {
    var self = this;
    var new_instance = new this(props);
    new_instance.save(function(err, saved_doc) {
      if (err) return callback(err);
      else return self.retrieveById(saved_doc._id, callback);
    });
  };

  schema.statics.retrieve = function(match, callback) {
    this.find(match).populate(options.populate).run(callback);
  };

  schema.statics.retrieveById = function(id, callback) {
    this.findById(id).populate(options.populate).run(function(err, doc) {
      if (err) {
        return callback(err);
      }
      else if (doc === null) {
        return callback({ code: 404, message: 'Not found' });
      }
      else return callback(undefined, doc);
    });
  };

  schema.statics.updateById = function(id, props, callback) {
    var self = this;
    this.findById(id).run(function(err, doc) {
      doc.set(props);
      doc.save(function(err, saved_doc) {
        if (err) return callback(err);
        else return self.retrieveById(saved_doc._id, callback);
      });
    });
  };

  schema.statics.updateManyById = function(updates, callback) {
    var self = this;
    function make_update(data, callback) {
      var id = data._id;
      delete data._id;
      self.update({ _id: id }, data, callback);
    }
    async.forEach(updates, make_update, callback);
  };

  schema.statics.deleteById = function(id, callback) {
    this.findById(id).remove().run(callback);
  };

};
