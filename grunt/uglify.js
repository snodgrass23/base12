module.exports = {
  options: {
    mangle: true,
    compress: true,
    beautify: false
  },
  build: {
    files: [{
      src: "<%= pkg.assets.mobile.libs %>",
      dest: "tmp/libs.js"
    }, {
      src: "<%= pkg.assets.mobile.login %>",
      dest: "app/public/mobile/compiled/login.js"
    }, {
      src: "<%= pkg.assets.mobile.app %>",
      dest: "app/public/mobile/compiled/app.js"
    }, {
      src: "<%= pkg.assets.mobile.event %>",
      dest: "app/public/mobile/compiled/event.js"
    }]
  }
};