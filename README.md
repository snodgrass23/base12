# [base12](http://base12.herokuapp.com/)

[12factor.net](http://12factor.net) web app platform for [node.js](http://node.js), built on [express 3](http://expressjs.com)

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

```shell
$ sudo npm install -g base12
$ base12 new projectname && cd projectname
$ make open
```

# Make commands

#### Install all modules and bower components

      $ make setup

#### Run the default build command using Grunt

      $ make build

#### Run the app with one process and without file change restarts

      $ make simple

#### Run the app with default settings and open browser to app url

      $ make open

#### Run the app with default number of processes (num cpu's in machine)

      $ make run

#### Run the app, limiting to a single process

      $ make run 1

#### Run the app and cycle on file changes

      $ make cycle

#### Run the app and cycle on file changes, limiting to a single process

      $ make cycle 1

#### Run the app with single process and node profiling

      $ make profile

#### Run the app with single process and node profiling using `prof_lazy` option

      $ make profile-lazy

#### Run the app with default settings with node debugging enabled (use node-inspector to view source and debug)

      $ make debug

#### Run the app with default settings with node debugging enabled and immediately break on first line

      $ make debug-brk


# What you get

**Production-ready**
- Painlessly follow [Ryan Dahl's 'gospel'](https://twitter.com/#!/ryah/statuses/161865845692301312) for node.js apps ([12factor.net](http://12factor.net) by Adam Wiggins).

**Cloud Deployments**
- Deploy to the cloud easily out of the box to Heroku using built in Procfile. Built in Mongoose and Redis support for connecting to RedisToGo and MongoLab addons.

**Structure**
- Always know where things go. An easy to use component driven layout with proven MVC architecture all on top of express.

**Express 3**
- Leverage the newest version of the most popular app framework for node.js.

**Not Rails**
- We believe that, if Rails is best for your project, you should use it.
Instead, base12 embraces the node.js way: light processes, shallow inheritance, simple interfaces, and the chain-of-responsibility pattern.

## Where stuff goes

```
assets                -- place to store assets for project (graphics, src files, etc.)
components            -- place to store components for small piecs of functionality in app
  /dashboard          -- default dashboard example component
  /errors             -- default component for handling server errors
  /user               -- default component for user functionality using mvc pattern (signup, signin, signout, settings)
doc                   -- documentation
lib                   -- app specific and non-npm-published node.js libraries
  /balance            -- uses cluster to create and blance multiple processes
  /config-load        -- loads available config files and environment variables
  /flash              -- flash messaging
  /inject             --
  /locals             -- add resuable local helpers to app views
  /middleware         -- sets up express middleware (stylus, sessions, logs)
  /mongoose           -- connects mongoose to mongodb
  /mongoose-util      -- provides mongoose helpers (validations, plugins, etc)
  /redis              -- provides app-wide redis connection
  /reload             -- watches for file changes and reloads app
public                -- static files are hosted here
scripts               -- scripts (eg admin, deployment, migrations)
test                  -- tests (mocha by default)
tmp                   -- your app can store temporary files here

app.js                -- runs your app
config.default.js     -- default config (no sensative passwords or location specific options)
config.local.js       -- local config (ignored by git, create to store sensative information and location specific options)
config.test.js        -- config for running tests
Makefile              -- automated task makefile
package.json          -- npm package.json
```


## Writing new components and libs

All base12 components have the same signature:

```javascript
module.exports = function(app) {
  // ...
  return my_module;
}
```

The component or lib is responsible for supplying the app with the needed interface hooks.  For example, a component might look like:

```javascript
module.exports = function(app) {
  app.get('/dashboard', function(req, res) {
    return res.render(require('path').join(__dirname, 'dashboard'), {
      user: req.session.user
    });
  });
};
```

You will then need to add the component to the main app file for loading.
``` javascript
var user = require('./components/user');
```
``` javascript
user(app, config);
```


## Updating constants and config

Application constants (values that do not change from machine to machine) are located in `config.default.js`.

```js
module.exports = {
  port: 3000,
  cluster: true,
  request_timeout: 100000,
  session_secret: "base12secret",
  log_requests: false,
  stylus_compress: 1,
  stylus_debug: 1,
  stylus_force: 1,
  test: false,
  redis: {
    host: "localhost",
    port: 6379,
    auth: "",
    debug: false
  },
  mongoose_url: "mongodb://localhost/base12"
};
```

Environment config (values that can change from machine to machine) are located in `config.local.js`, which is not tracked by git.
You can create this file whenever needed and it values will override the defaults if both exist.

```js
module.exports = {
  port: 80,
  mongoose_url: "mongodb://username:passsword@127.0.0.1/base12"
};
```

All system environment variables will also act as local config object and will also override default settings of the same name. This leaves it up to the developer and environment which way they want to specify location dependent settings.



## The 12 Factors

### 1. Codebase

"One codebase tracked in version control, many deploys."

Base12 uses git-based deployments exclusively.

### 2. Dependencies

"Explicitly declare and isolate dependencies."

Base12 uses `npm install` both locally and in deploys to manage dependencies.
Manage your dependencies in `package.json`.

### 3. Config

"Store config in the environment."

Base12 uses the untracked config.local.js file to manage environment config. It will also pull in available environment variables for instant compatibility with cloud providers like Heroku.

### 4. Backing services

"Treat backing services as attached resources."

Backing service configuration is stored in config.local.js or environment variables on each host.

### 5. Build, release, run

"Strictly separate build and run stages."

`make build` builds a base12 app's assetes, while `make run` executes it. `make cycle` watches local files and cycles between build and run phases for rapid development.

### 6. Processes

"Execute the app as one or more stateless processes."

Base12 apps are stateless. The built-in session manager is backed by redis, and apps can be run as any number of independent processes forked from app.js.
The directory structure provides /tmp for temporary file manipulation, but provides no permanent file storage mechanism since that should be done through a backing service.

### 7. Port binding

"Export services via port binding."

Ultimately, base12 relies on node's built-in http server to field requests. No http container or helper is needed.

### 8. Concurrency

"Scale out via the process model."

Using deployment-specific process managers (eg, upstart), base12 keeps the master node.js process running.
In `make run` base12 uses cluster to spawn and monitor multiple processes on a single machine.

### 9. Disposability

"Maximize robustness with fast startup and graceful shutdown."

Base12 uses a crash-only design. Uncaught errors exit the process, triggering the balancer to replace it.
Startup is nearly immediate.

### 10. Dev/prod parity

"Keep development, staging, and production as similar as possible."

We encourage you to keep your config.local.js configurations as similar as possible across machines to maximize parity.

### 11. Logs

"Treat logs as event streams."

Base12 logs events directly to stdout and stderr.

### 12. Admin processes

"Run admin/management tasks as one-off processes."

All admin processes are handled with scripts in the /scripts directory.
Built-in scripts include provisioning and deployment, tests, dependency management, and generators.

## System Requirements

  * node.js >= 0.8.x
  * npm >= 1.1.x
  * redis (for default session management)
  * mongodb (if using default user component)

