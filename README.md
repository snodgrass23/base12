# base12
      
[12factor.net](http://12factor.net) app boilerplate for [node.js](http://node.js), built on [express 3](http://expressjs.com)

    ```shell
    git clone git://github.com/hunterloftis/base12.git projectname
    cd projectname
    npm install
    sudo node run
    ```

**12 Factor**
- Painlessly follow Ryan Dahl's 'gospel' for production-ready node.js apps (12factor.net)

**Cloud Deployments**
- Deploy to the cloud easily and immediately (joyent, heroku, amazon, linode, rackspace, nodejitsu)

**Structure**
- Always know where things go. A proven MVC architecture on top of express.

**Express 3**
- Leverage the newest version of the most popular app framework for node.js.

**Not Rails**
- We believe that, if Rails is best for your project, you should use it.
Instead, base12 embraces the node.js way: light processes, shallow inheritance, simple interfaces, and the chain-of-responsibility pattern.

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
