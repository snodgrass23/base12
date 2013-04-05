#!/usr/bin/env node

var fs = require('fs');
var packages = require('../package.json');

packages.dependencies = updateVersions('dependencies');
packages.devDependencies = updateVersions('devDependencies');


result = fs.writeFile('./package.json', JSON.stringify(packages, null, 4), function(err) {
  if (err) console.log("ERROR: ", err);
});



function updateVersions(section) {
  var module, versions = {};

  for (var p in packages[section]) {
    module = require('../node_modules/'+p+'/package.json');
    if (packages[section][p] == 'latest') versions[p] = module.version;
    else versions[p] = packages[section][p];
  }

  return versions;
}