# hold up!

We've just made some big improvements to base12 internally -- we've also factored out deployment to a system called `nimbus`
which you can find here:

https://github.com/skookum/nimbus

In the next 2-3 days, we'll be publishing the next - simpler, faster, more stable - version. Watch the project,
and try it out.

cheers,

SDW

# base12

[12factor.net](http://12factor.net) web app platform for [node.js](http://node.js), built on [express 3](http://expressjs.com)

We are porting our 2-year evolved boilerplate from [Skookum Digital Works](http://skookum.com) into this project. Expect lots of updates!

```shell
$ sudo npm install -g base12
$ base12 new projectname && cd projectname
$ node run
```

# What you get

**Production-ready**
- Painlessly follow [Ryan Dahl's 'gospel'](https://twitter.com/#!/ryah/statuses/161865845692301312) for node.js apps ([12factor.net](http://12factor.net) by Adam Wiggins).

**Cloud Deployments**
- Deploy to the cloud easily, out-of-the-box (supports joyent, amazon, linode, rackspace; TODO: heroku, nodejitsu).

**Structure**
- Always know where things go. A proven MVC architecture on top of express.

**Express 3**
- Leverage the newest version of the most popular app framework for node.js.

**Not Rails**
- We believe that, if Rails is best for your project, you should use it.
Instead, base12 embraces the node.js way: light processes, shallow inheritance, simple interfaces, and the chain-of-responsibility pattern.

## Startup process...

  1. `$ node cycle` builds your app and calls `run.js`.
  2. `run.js` uses base12.balance() to run `app/index.js`.
  3. `app/index.js` loads everything from `app/(models, views, controllers, middleware)`.
  4. `app/index.js` opens `app/lib/index.json` and runs lib files in the order specified by `autorun`.
  5. `app/index.js` starts listening for requests.

## Where stuff goes

```
app
  /controllers      -- controllers are automatically loaded (user.js -> app.controllers.user)
  /lib              -- app-specific modules (default: routes.js, middleware.js, locals.js)
  /middleware       -- middleware is automatically loaded (auth.js -> app.middleware.auth)
  /models           -- models are automatically loaded (project.js -> app.models.project)
  /public           -- static files are hosted here
  /shared           -- isomorphic (client/server) files are hosted here
  /views            -- view templates are automatically loaded via express
  index.js          -- starts your application with `base12.app()`

doc                 -- documentation
env                 -- named environment configurations (eg `staging`, `deployment`)
lib                 -- non-npm-published node.js libraries
scripts             -- scripts (eg admin, deployment, migrations)
test                -- tests (vows by default)
tmp                 -- your app can store temporary files here

package.json        -- npm package.json (base12 app `constants` stored here)
.env.js             -- environment config (created by `npm install`)

build.js            -- builds assets
run.js              -- runs your app
cycle.js            -- watches local files and builds/runs on changes (for development)
```

## Writing controllers, models, middleware, and libs

All base12 modules have the same signature:

```javascript
module.exports = function(app) {
  // ...
  return my_module;
}
```

For example, a controller might look like:

```javascript
module.exports = function(app) {
  return {
    index: function(req, res) {
      var widgets = app.models.widgets.get_all();
      res.send(widgets);
    },
    show: function(req, res) {
      var widget = app.models.widget.get_one();
      res.send(widget);
    }
  };
};
```

A model (using mongoose) might look like:

```javascript
var mongoose = require('mongoose');

module.exports = function(app) {
  var WidgetSchema = new mongoose.Schema({
    name: String
  });

  return mongoose.Model('widget', WidgetSchema);
};
```

## Updating constants and config

Application constants (values that do not change from machine to machine) are located under `constants` in package.json.
Base12 also pulls the project `name` from the default package.json structure:

```json
"name":"base12app",
"constants": {
  "title": "node.js 12-factor app",
  "session_length": 1209600000,
  "request_timeout": 10000
}
```

Environment config (values that can change from machine to machine) are located in `.env.js`, which is not tracked by git.
Running `npm install` will provide you with a default .env.js from env/default.env.js if one does not already exist.

```javascript
module.exports = {
  view_engine: 'jade',
  view_options: { layout: false },
  port: 3000,
  timeout: 10000,
  cookie_secret: 'mysecret',
  session: {
    key: 'mykey'
  },
  redis: {
    host: 'localhost',
    port: 6379
  }
};
```

## Extending express

base12.app() augments express() with a thin layer of auto-loaded hashes:

  * app.models (from app/models)
  * app.controllers (from app/controllers)
  * app.middleware (from app/middleware)

  * app.constants (from package.json)
  * app.config (from .env.js)

Otherwise, `base12.app()` is just like `express()`.

## Common commands

### Install packages and default environment config

      $ npm install

### Build assets (TODO)

      $ node build

### Run the app

      $ node run

### Run the app, limiting to a single process

      $ node run 1

### Cycle the app, building then running on file change

      $ node cycle

### Lock packages

      $ npm run-script lock

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

Base12 uses the untracked .env.js file to manage environment config. Once tooling is better supported on hosts, it will likely move to environment variables.

### 4. Backing services

"Treat backing services as attached resources."

Backing service configuration is stored in .env.js on each host.

### 5. Build, release, run

"Strictly separate build and run stages."

`node build` builds a base12 app, while `node run` executes it. `node cycle` watches local files and cycles between build and run phases for rapid development.

### 6. Processes

"Execute the app as one or more stateless processes."

Base12 apps are stateless. The built-in session manager is backed by redis, and apps can be run as any number of independent processes forked from app/index.js.
The directory structure provides /tmp for temporary file manipulation, but provides no permanent file storage mechanism since that should be done through a backing service.

### 7. Port binding

"Export services via port binding."

Ultimately, base12 relies on node's built-in http server to field requests. No http container or helper is needed.

### 8. Concurrency

"Scale out via the process model."

Using deployment-specific process managers (eg, upstart), base12 keeps the master node.js process running.
In run.js, `base12.balance` uses cluster to spawn and monitor multiple processes on a single machine.
New process types can be created by writing modules with a `start()` method, and passing that process module to `base12.balance()` in run.js.

### 9. Disposability

"Maximize robustness with fast startup and graceful shutdown."

Base12 uses a crash-only design. Uncaught errors exit the process, triggering the balancer to replace it.
Startup is nearly immediate.

### 10. Dev/prod parity

"Keep development, staging, and production as similar as possible."

We encourage you to keep your .env.js configurations as similar as possible across machines to maximize parity.

### 11. Logs

"Treat logs as event streams."

Base12 logs events directly to stdout and stderr.

### 12. Admin processes

"Run admin/management tasks as one-off processes."

All admin processes are handled with scripts in the /scripts directory.
Built-in scripts include provisioning and deployment, tests, dependency management, and generators.

## System Requirements

  * node.js >= 0.6.x
  * npm >= 1.1.x
  * redis