module.exports = {
  components: {
    files: [{
      src: [
        "public/scripts/components/jquery/jquery.min.js",
        "public/scripts/components/lodash/dist/lodash.min.js",
        "public/scripts/components/angular-unstable/angular.min.js"
      ],
      dest: "public/scripts/compiled/components.js"
    }]
  }
};