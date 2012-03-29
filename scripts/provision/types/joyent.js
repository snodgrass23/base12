module.exports = function(config) {
  return {

    setup: function() {
      console.log("Setting up for Joyent");
      console.log("Config is:", config);
    }

  };
};