[![CircleCI Status][cibadge]][ci]

---
# whodunnit

`whodunnit` is a simple to use progress tracker for teams.


## Dependencies

Dependencies are managed through `npm`. You can install them with:

```sh
npm install
```

Builds are managed via gulp v4. You will also require Knex for doing database
migration. You can install them with:

```sh
npm install -g gulp-cli knex
```


## Configuring

`whodunnit` requires a configuration file (`config.js`). An example
configuration file is provided in `contrib/`. The configuration options are as
follows:

```javascript
{
  port: '9999',              // The port to run the server on.
  db: {
    client: "pg",            // The SQL client.
    connection: {
      user: "user",          // Database user.
      password: "password",  // Database password.
      database: "whodunnit", // Database name.
      port: 5432,            // Database port.
    },
  },
}
```


## Building & Running

To build and run `whodunnit`, run:

```sh
gulp build
node start
```

This will build both the client and the server. By default, `whodunnit` runs in
development mode, which will generate a server that serves static files. If
built with `--production`, the server will *not* serve static files and they
must be served by your webserver.

`whodunnit` also provides a development server, which can be run via:

```sh
gulp serve [--disable-browsersync]
```


[ci]: https://circleci.com/gh/brennie/whodunnit
[cibadge]: https://circleci.com/gh/brennie/whodunnit.svg?circle-token=79d3093a43479aedda674bd51377c3ea32e0a90d
[browsersync]: https://www.browsersync.io/
