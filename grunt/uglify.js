module.exports = {
  options: {
    mangle: true,
    compress: true,
    beautify: false
  },
  build: {
    files: [{
      src: "public/scripts/*.js",
      dest: "public/scripts/compiled/app.js"
    }]
  }
};