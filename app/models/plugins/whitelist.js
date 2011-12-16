module.exports = exports = function WhitelistPlugin (schema, options) {

  schema.pre('save', function (next) {

    // loop through all properties
    for(var p in this._doc) {

      // check if property is part of schema, if not delete it
      if ( !(p in schema.paths)) delete this._doc[p];
    }
  
    next();
  });

};