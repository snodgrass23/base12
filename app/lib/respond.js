var headers = {
  'Content-Type':'text/html',
  'Expires': 'Fri, 30 Oct 1998 14:19:41 GMT',
  'Cache-Control': 'no-cache, must-revalidate',
  'Access-Control-Allow-Origin': '*'
};

module.exports = function respond(err, req, res, data, code, message) {
  var response, json;
  if (err) json = JSON.stringify({code: code || err.code || 500, data: data, message: message || err.message});
  else json = JSON.stringify({code: code || 200, data: data, message: message});
  if (req.query.callback) {
    json = req.query.callback + '(' + json + ');';  // JSONP
  }
  res.send(json, headers, 200);
};