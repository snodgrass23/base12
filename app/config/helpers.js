exports = module.exports = function() {
  
  server.helpers({
    
    embed_json: function(obj, name) {
      var escaped = JSON.stringify(obj).replace(/\\/g, '\\\\').replace(/<\/script>/g, '');
      return "<script> " + name + " = " + escaped + "; </script>";
    },
    
    embed: function(obj, name) {
      return "<script> " + name + " = \"" + obj + "\"; </script>";
    },
    
    embed_json_func: function(obj, name) {
      var escaped = JSON.stringify(obj).replace(/\\/g, '\\\\').replace(/<\/script>/g, '');
      return "<script> " + name + "( " + escaped + " ); </script>";
    }
  });

  server.dynamicHelpers({
    messages: require('express-messages'),
    current_user: function(req, res) {     
      if (req.user) {
        return req.user;
      }
      else return null;
    },
    is_logged_in: function(req, res) {
      console.log("user: ", req.user)
      console.log("session.user: ", req.session.user)
      return (typeof req.user != 'undefined');
    }
  });
};