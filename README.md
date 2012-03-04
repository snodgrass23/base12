# base12
      
[12factor.net](http://12factor.net) app boilerplate for [node.js](http://node.js), built on [express 3](http://expressjs.com)

```shell
$ git clone git://github.com/hunterloftis/base12.git projectname
$ cd projectname
$ npm install
$ node run
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

When base12 starts, it runs `/index.js`, which uses `base12.balance()` to balance app processes via `cluster` (1 process per cpu).

Each process runs `/app/index.js`, which creates a new app with `base12.app()`. The `app` instance is passed into all modules. 

Once all modules have run, the app starts listening for requests.

## Writing controllers, models, middleware, and libs

## Building on Express 3

## Common commands

### Install packages and default environment config

      $ npm install

### Build assets

      $ node build

### Run the app

      $ node run

### Run the app, limiting to a single process

      $ node run 1

### Lock packages

      $ npm run-script lock

## The 12 Factors

### 1. Codebase

### 2. Dependencies

### 3. Config

### 4. Backing services

### 5. Build, release, run

### 6. Processes

### 7. Port binding

### 8. Concurrency

### 9. Disposability

### 10. Dev/prod parity

### 11. Logs

### 12. Admin processes

## System Requirements
