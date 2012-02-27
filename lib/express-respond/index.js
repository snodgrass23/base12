var headers = {
  'Content-Type':'text/html',
  'Expires': 'Fri, 30 Oct 1998 14:19:41 GMT',
  'Cache-Control': 'no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*'
};

function respond (err, req, res, data, code, message) {
  var response, json;
  if (err) json = JSON.stringify({code: code || err.code || 500, data: data, message: message || err.message});
  else json = JSON.stringify({code: code || 200, data: data, message: message});
  if (req.query.callback) {
    json = req.query.callback + '(' + json + ');';  // JSONP
  }
  res.send(json, headers, 200);
}

function log(err, req, res, next) {
  console.warn('Sending user this error:', err);
  console.warn('Stack:', err.stack);
  return next(err);
}

function error(err, req, res, next) {
  err = err.message || err;
  if (req.format === 'json') return respond(err, req, res);
  else {
    req.flash('error', '<strong>Sorry, we had some issues:</strong> ' + err);
    return next(err);
  }
}

function bounce(err, req, res, next) {
  res.redirect(req.header('Referer') || '/');
}

module.exports = {
  respond: respond,
  log: log,
  error: error,
  bounce: bounce
};