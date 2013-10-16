module.exports = {
  minLibs: {
    src: "<%= pkg.assets.mobile.minLibs %>",
    dest: "tmp/min-libs.js"
  },
  all: {
    src: [
      "tmp/min-libs.js",
      "tmp/libs.js"
    ],
    dest: "app/public/mobile/compiled/libs.js"
  }
};