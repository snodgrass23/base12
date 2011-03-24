exports = module.exports = function(server) {
  
  // Handle uncaught exceptions

  process.on("uncaughtException", function(err){
    console.warn("caught unhandled exception:")
    console.warn(err.stack || err)
    console.log("Exiting process due to uncaught exception!")
    process.exit()
  })
  
  
  // Respond to standard request errors
  
  server.error(function(err, req, res, next){
    res.send("Internal Server Error", 500);
    console.warn("Internal server error");
    /*
    if (!err || 2 !== err.errno)
      return res.render("500.jade", { layout: "layout.error.jade" }, function(err, content){
        res.send(content || "Internal Server Error", 500)  
      })
    
    res.render("404.jade", { layout: "layout.error.jade" }, function(err, content){
      res.send(content || "File Not Found", 404)  
    })
    */
  });
  
}