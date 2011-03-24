# node-boilerplate
      
  Structure for your node project.
  
  Built on [node](http://nodejs.org).

## Installation (contributor)

    mkdir mynewproject
    cd mynewproject
    git clone -b edge git@github.com:Skookum/node-boilerplate.git .
    git checkout -b mynewproject
    sudo npm bundle
    sudo node server.js
  
## Installation (user)

    mkdir mynewproject
    cd mynewproject
    git clone -b edge https://github.com/skookum/node-boilerplate.git .
    git checkout -b mynewproject
    sudo npm bundle
    sudo node server.js

## Adding libraries

  Add to 'dependencies' in /package.json, then:
  
    sudo npm bundle
    
## Included modules:

  - Express
  - Jade
  - Stylus
  - Connect-Timeout
  - Cluster
  - Express-Messages
  