module.exports = {
  view_engine: 'jade',
  view_options: { layout: false },
  port: 80,
  timeout: 10000,
  cookie_secret: 'mysecret',
  session: {
    secret: 'mysecret',
    key: 'mykey'
  },
  redis: {
    host: 'localhost',
    port: 6379
  },
  mongo: {
    db: 'mongodb://localhost/boilerplate'
  }
};