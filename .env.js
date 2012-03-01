module.exports = {
  view_engine: 'jade',
  view_options: { layout: false },
  port: 80,
  timeout: 10000,
  session: {
    secret: 'mysecret',
    key: 'mykey'
  },
  redis: {
    host: 'localhost',
    port: 6379
  }
};