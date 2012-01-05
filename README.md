# node-boilerplate
      
  Structure for your non-trivial [node.js](http://nodejs.org) project.

## 1. Develop

  Linux/OSX running [node](http://nodejs.org) v0.6.x, [mongodb](http://mongodb.org) & [redis](http://redis.io)

  ```shell
  mkdir projectname
  git clone git://github.com/skookum/node-boilerplate.git projectname && cd projectname
  sudo npm install
  sudo node server
  ```

## 2. Provision
  
  Ubuntu VPS (eg, Linode)

  - fill out `scripts/deploy.conf`
  - add developers' public keys to `scripts/provisioning/keys`
  - add deploy user's private key outside the repository (TODO: make this optional since it's only necessary for private repos)
  
  ```
  cd scripts
  ./provision staging root
  ```

## 3. Deploy

  ```
  cd scripts
  ./deploy staging setup
  ./deploy staging
  ```