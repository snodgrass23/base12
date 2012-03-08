#!/usr/bin/env node

console.log("running generate script");

require('path').exists('./generate/'+process.argv[2]+'.js', function(exists) {
  if (exists) {
    require('./generate/'+process.argv[2])();
  }
  else {
    console.log("Unable to find a generator for: " + process.argv[2]); 
  }
});