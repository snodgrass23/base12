# node-boilerplate
      
  Structure for your non-trivial [node.js](http://nodejs.org) project.

## 1. Develop

  Linux/OSX running [node](http://nodejs.org) v0.6.x, [mongodb](http://mongodb.org) & [redis](http://redis.io)

  ```shell
  mkdir projectname
  git clone git://github.com/hunterloftis/node-boilerplate.git projectname
  cd projectname
  ```

  check your system requirements and start local databases:

  ```shell
  scripts/requirements
  redis-server
  mongod
  ```

  try it:

  ```shell
  sudo npm install
  sudo node server
  ```

  - code, code, code
  - set up git repository hosting your project (eg, on Github)

## 2. Provision
  
  Ubuntu VPS (eg, [Linode](http://linode.com))

  - fill out `scripts/deploy.conf`
  - add developers' public keys to `scripts/provisioning/keys`
  - add deploy user's private key outside the repository (TODO: make this optional since it's only necessary for private repos)
  
  ```
  cd scripts
  ./provision staging root
  ```

## 3. Deploy
  
  Also within /scripts:

  ```
  ./deploy staging setup
  ./deploy staging
  ```