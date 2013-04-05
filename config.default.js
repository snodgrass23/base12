var port = 3000;

module.exports = {

  port: port,
  request_timeout: 100000,
  session_secret: "base12secret",
  log_requests: false,
  stylus_compress: 1,
  stylus_debug: 1,
  stylus_force: 1,
  test: false,
  redis: {
    host: "localhost",
    port: 6379,
    auth: "",
    debug: false
  },
  mongoose_url: "mongodb://localhost/base12",
  send_mail: true,
  contact_email: "jim@skookum.com",
  host: "http://localhost:"+port
};