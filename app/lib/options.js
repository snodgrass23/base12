var ONE_SECOND = 1000;
var ONE_HOUR = ONE_SECOND * 60 * 60;
var ONE_DAY = ONE_HOUR * 24;
var TWO_WEEKS = ONE_DAY * 14;

module.exports = {
  name: 'node12',
  title: 'node.js 12-factor app',
  session_length: TWO_WEEKS,
  request_timeout: ONE_SECOND * 10
};