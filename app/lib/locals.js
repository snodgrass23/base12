module.exports = function(app) {
  
  // Dynamic locals

  // expose error' and 'message' to all views that are rendered
  app.locals.use(function(req, res) {
    res.locals.error = req.session.error || '';
    res.locals.message = req.session.message || '';
    // delete them so they're not displayed on subsequent renders
    delete req.session.error;
    delete req.session.message;
  });

  // Static locals

  app.locals({
    
    route: function(action) {
      var map = {
        'login': '/sessions/login',
        'logout': '/sessions/logout',
        'register': '/users/new'
      };
      return (map[action] ? map[action] : '');
    },

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
    },

    relative_date: function(olderDate) {

      if (typeof olderDate == "string") olderDate = new Date(olderDate);
      newerDate = new Date();

      var milliseconds = newerDate - olderDate;

      var conversions = [
        ["years", 31518720000],
        ["months", 2626560000 /* assumes there are 30.4 days in a month */],
        ["days", 86400000],
        ["hours", 3600000],
        ["minutes", 60000],
        ["seconds", 1000]
      ];

      for (var i = 0; i < conversions.length; i++) {
        var result = Math.floor(milliseconds / conversions[i][1]);
        if (result >= 2) {
          return result + " " + conversions[i][0] + " ago";
        }
      }

      return "1 second ago";
    },

    simple_format: function(text) {
      text = this.escape_html(text);
      return text.replace(/\n/g, "<br>");
    },

    escape_html: function(s) {
     var MAP = {
       '&': '&amp;',
       '<': '&lt;',
       '>': '&gt;',
       '"': '&#34;',
       "'": '&#39;'
     };
      var repl = function(c) { return MAP[c]; };
      return s.replace(/[&<>'"]/g, repl);
    }
  });
};