module.exports = function() {
  process.on("uncaughtException", function(err){
    console.warn("Exiting process due to uncaught exception!");
    console.warn(err.stack || err);
    process.exit();
  });
};