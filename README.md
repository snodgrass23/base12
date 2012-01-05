# node-boilerplate
      
  Structure for your non-trivial [node.js](http://nodejs.org) project.

## Prerequisites

  linux/osx, node 0.6.x; optional (but on by default): mongodb, redis

## 1. Development

  ```shell
  git clone git://github.com/skookum/node-boilerplate.git
  cd node-boilerplate
  sudo npm install
  sudo node server
  ```

## 2. Provisioning

  - specify scripts/deploy.conf
  - add developers' public keys to scripts/provisioning/keys
  ```
  cd scripts
  ./provision staging root
  ```

## 3. Deployment

  ```
  cd scripts
  ./deploy staging setup
  ./deploy staging
  ```

## Adding libraries

  Add to 'dependencies' in /package.json, then:
  
  ```shell
  sudo npm install
  ```