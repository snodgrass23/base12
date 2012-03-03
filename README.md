# base12
      
[12factor.net](http://12factor.net) app boilerplate for [node.js](http://node.js), built on [express 3](http://expressjs.com)

You can:

  * cloud deploy out-of-the-box (joyent, heroku, amazon, linode, rackspace, nodejitsu, etc)
  * easily follow Ryan Dahl's 'gospel' for production-ready node.js apps (12factor.net)
  * always know where things go (consistent app structure)
  * leverage the newest version of node's most popular app framework (express 3.0)
  * do things 'the node way' (not a rails clone)

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

## Common commands
