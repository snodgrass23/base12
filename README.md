# node-boilerplate
      
Structure for your non-trivial [node.js](http://nodejs.org) project.

## Quick Start

### Develop

Linux/OSX running [node](http://nodejs.org) v0.6.x, [mongodb](http://mongodb.org) & [redis](http://redis.io)

1. get the boilerplate:

    ```shell
    mkdir projectname
    git clone git://github.com/hunterloftis/node-boilerplate.git projectname
    cd projectname
    ```

2. check your system requirements and start local databases:

    ```shell
    scripts/requirements
    redis-server
    mongod
    ```

3. try it:

    ```shell
    sudo npm install
    sudo node server
    ```

4. code, code, code
5. set up git repository hosting your project (eg, on Github)

### Provision
  
Ubuntu VPS (eg, [Linode](http://linode.com))

1. fill out `scripts/deploy.conf`:
    
  - **project**: the name of your project (eg, 'boilerplate')
  - **repo**: your git repository (eg, git://github.com/hunterloftis/node-boilerplate.git)
  - **host**: the IP address of your server
  - **private (/dev/null)**: the absolute path to a private key for your deploy user (to access a private git repository)
  - **environment (staging)**: a string that sets NODE_ENV
  - **ref (origin/master)**: the default git ref to deploy from
  
2. add developers' public keys to `scripts/provisioning/keys` (they will be authorized for 'root')
  
    ```
    cd scripts
    ./provision staging root
    ```

### Deploy
  
3. Run within /scripts:

    ```
    ./deploy staging setup
    ./deploy staging
    ```