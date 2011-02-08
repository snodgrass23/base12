/*!
 * Resourceful
 * Copyright(c) 2010 Skookum <labs.skookum.com>
 * MIT Licensed
 *
 * @author Hunter Loftis <hunter@skookum.com>
 * @requires expressJS - This decorates an Express Server
 * @version 0.1
 */
 
/** @private */
var path = require('path'), objutils = require('objutils')

// From Crockford:

function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (value instanceof Array) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

// From ConnectJS:

function get_keys(path) {
  var keys = []
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push(key);
        slash = slash || '';
        return ''
            + (optional ? '' : slash)
            + '(?:'
            + (optional ? slash : '')
            + (format || '') + (capture || '([^/.]+)') + ')'
            + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)');
  return keys;
}


module.exports = function(server) {

  function get_view(req, res) {
    var view = {}
    view.format = req.param('format')
    if (view.format === 'json') {
      
      var response = {
        success: true,      // Default
        message: null,
        data: null
      }
      view.render = function(data, template) {
        objutils.merge(response, data)
        res.headers['Content-Type'] = 'text/html'
        res.send(response)
      }
      view.status = function(type, msg) {
        if(type === 'error') response.success = false
        response.message = msg
      }
      view.redirect = function(url, data) {
        response.data = data
        res.send(response)
      }
    }
    else {
      view.render = function(data, template) {
        if (!template) {
          throw new Error("Template is not defined for view.render() but requested format is html")
        }
        res.render(template, data)
      }
      view.status = function() {
        req.flash.apply(req, arguments)
      }
      view.redirect = function(url) {     // TODO: Find a more elegant way to match this with the json redirect above
        res.redirect.apply(res, [url])
      }
    }
    return view  
  }

  function wrap_handlers(handlers, keys) {
    if (handlers.length > 0) {
      var wrapped_handlers = []
      handlers.forEach(function(handler) {
      
        wrapped_handlers.push (                   // TODO: Clarify this convoluted stuff
          function(req, res) {
            var view = get_view(req, res),
                next_fn = arguments.callee._next,
                next = function(err) {
                  next_fn.apply(next_fn, params)
                }
                params = [req, res, next, view]
            keys.forEach(function(key) {
              params.push(req.param(key))
            })
            if (req.body) {
              params.push(req.body)
            }
            if (handler) handler.apply(handler, params)   // TODO: Make this more efficient than just an if statement
          }
        )
      })
      for (var i = 0; i < wrapped_handlers.length; i++) {
        wrapped_handlers[i]._next = wrapped_handlers[i + 1] ? wrapped_handlers[i + 1] : null
      }
      return wrapped_handlers
    }
    return null
  }
  
  server.map = function(method, route) {
    var handlers = Array.prototype.slice.call(arguments, 2)
    if (typeOf(handlers[0]) === 'array') {
      handlers = handlers[0]
    }
    if (method && route && handlers[0]) {
      if (method === 'crud') {
        var handler = handlers.pop(1)
        if (handler.index) this.map('get', route, handlers.concat(handler.index))
        if (handler.create) this.map('post', route, handlers.concat(handler.create))        
        if (handler.new) this.map('all', route + '/new', handlers.concat(handler.new))
        if (handler.edit) this.map('all', route + '/:id/edit', handlers.concat(handler.edit))
        if (handler.show) this.map('get', route + '/:id', handlers.concat(handler.show))
        if (handler.update) this.map('post', route + '/:id', handlers.concat(handler.update))
        if (handler.delete) this.map('post', route + '/:id/delete', handlers.concat(handler.delete))
      }
      else {
        var keys = get_keys(route),
            wraps = wrap_handlers(handlers, keys)
        console.log("Map\t" + method.toUpperCase() + "\t" + route + " ==> function(" + keys.join(',') + ")")
        route += ".:format?"
        server[method].apply(server, [route].concat(wraps))
      }
    }
  }
    
}
  
