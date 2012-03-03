# base12
      
[12factor.net](http://12factor.net) app boilerplate for [node.js](http://node.js), built on [express 3](http://expressjs.com)

----------------

**12 Factor**
- Painlessly follow Ryan Dahl's 'gospel' for production-ready node.js apps (12factor.net)

**Cloud Deployments**
- Deploy to the cloud easily, immediately (joyent, heroku, amazon, linode, rackspace, nodejitsu, etc)

**Structure**
- Always know where things go. Base12 encourages best practices by design.

**Express 3**
- Leverage the newest version of node's most popular app framework.

**Not Rails**
- We believe that, if Rails is best for your project, you should use it.
Instead, base12 embraces the node.js way: light processes, shallow inheritance, simple interfaces, and the chain-of-responsibility pattern.

## For the lazy

    ```shell
    mkdir projectname
    git clone git://github.com/hunterloftis/node-boilerplate.git projectname
    cd projectname
    sudo node run
    ```

## Where stuff goes

    ```
    app
      /controllers
      /lib
      /middleware
      /models
      /public
      /shared
      /views
      index.js
    doc
    env
    lib
    scripts
    test
    tmp

    package.json
    .env.js

    build.js
    run.js
    cycle.js
    ```

When base12 starts, it runs `/index.js`. By default, `/index.js` uses base12.balance (and `cluster`)
to balance multiple app processes (1 for each core of the host machine).

Each app process runs `/app/index.js`, which creates a new `base12.app` and specifies modules that should be called
to initialize the app. The `app` instance is passed into all modules. 

Once all modules have run, the app starts listening for requests.

## Writing controllers, models, middleware, and libs


## Building on Express 3

## Common commands
