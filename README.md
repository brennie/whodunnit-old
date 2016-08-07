[![CircleCI Status][cibadge]][ci]

---
# whodunnit

`whodunnit` is a simple to use progress tracker for teams.


## Dependencies

Dependencies are managed through `npm`. You can install them with:

```sh
npm install
```

Builds are managed via gulp v4. You can install the gulp CLI with:

```sh
npm install -g gulp-cli
```


## Configuring

`whodunnit` requires a configuration file (`config.js`). An example
configuration file is provided in `contrib/`. The configuration options are as
follows:

```javascript
{
  port: 9999,  // The port to run the server on.
}
```


## Building & Running

To build `whodunnit`, run:

```sh
gulp build [--production]
```

This will build both the client and the server. By default, `whodunnit` runs in
development mode, which will generate a server that serves static files. If
built with `--production`, the server will *not* serve static files and they
must be served by your webserver.

`whodunnit` also provides a server, which can be run via:

```sh
gulp serve [--production] [--disable-browsersync]
```

Again, this will run in development mode by default and will serve static files.
When run with `--production`, it will *not* serve static files. When running in
development mode, a [Browsersync][browsersync] session will be launched if
`--disable-browsersync` is not provided, proxying the backend and providing a
live-reloading front-end.


[ci]: https://circleci.com/gh/brennie/whodunnit
[cibadge]: https://circleci.com/gh/brennie/whodunnit.svg?circle-token=79d3093a43479aedda674bd51377c3ea32e0a90d
[browsersync]: https://www.browsersync.io/
