#!/usr/bin/env node

var fs = require('fs');

var packages = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

var versions = {};

for (var p in packages.dependencies) {
  var module = JSON.parse(fs.readFileSync('./node_modules/'+p+'/package.json', 'utf-8'));
  if (packages.dependencies[p] == 'latest') versions[p] = module.version;
  else versions[p] = packages.dependencies[p];
}

packages.dependencies = versions;

fs.writeFileSync('./package.json', JSON.stringify(packages, null, 4), 'utf-8');