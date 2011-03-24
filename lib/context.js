// Allows views to render based on context (HTML or JSON)
// Works with express-messages
// TODO: Monkey patch express (so each request doesn't have to add these functions in, that's a performance hit)
// TODO: Also handle redirects like in resourceful

exports = module.exports = function(req, res, next) {

  res.status = res.status || function(code, type, message) {
    res._context = {
      status: code,
      type: type,
      message: message || ''
    };
  };
  
  res.context = res.context || function(data, template, format) {
    
    res._context = res._context || {
      status: 200,
      message: ''
    };
    
    res.header('Content-Type', 'text/html');  // Hack to avoid Firefox & IE tossing up dialogs for JSON
    
    // json
    
    if (template === undefined || format === 'json') {
      res._context.data = data;
      res.send(res._context);
    }
    
    // html
    
    else {
      if (res._context.message !== '') {
        console.log("Flashing message " + res._context.message);
        req.flash(res._context.type, res._context.message);
      }
      res.render(template, data);
    }
  };
  
  next();
  
}