var sendmail = require('email'),
    fs = require('fs'),
    cachedTemplates = {};


_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};



module.exports = function(app){
  
  var config = app.config;

  var default_props = {
    contact_email: config.contact_email,
    host: config.host
  };

  app.emailer = {

    send: function(message, props, callback) {
      if (config.test || !config.send_mail) return false;
      
      callback = callback || function() {};
      
      _load_template(__dirname+'/templates/' + message + '.html', _.extend(props, default_props), function(err, options) {
        // console.log("sending email: ", err, props);
        if (!err) new sendmail.Email(options).send(callback);
        else callback(err);
      });
    }
  };

};

function _load_template(file, props, callback) {
  
  // check cache for template
  if (cachedTemplates[file]) {
    buildEmail(cachedTemplates[file]);
  }
  
  // load template from file
  else {
    fs.readFile(file, function (err, data) {
      if (!err && data) {      
        cachedTemplates[file] = data;
        buildEmail(data);  
      }
      else callback(err);
    });  
  }
  
  function buildEmail(template) {
    var temp_file = _.template(template.toString(), props),
            split_i = temp_file.indexOf('\n\n'),
            options = JSON.parse('{' + temp_file.slice(0, split_i) + '}');
      options.body = temp_file.slice(split_i + 1);
      callback(null, options);
  }
}