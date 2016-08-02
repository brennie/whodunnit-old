# whodunnit

`whodunnit` is a simple to use progress tracker for teams.


## Dependencies

Dependencies are managed through `npm`. You can install them with:

```sh
npm install
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
gulp serve [--production]
```

Again, this will run in development mode by default and will serve static files.
When run with `--production`, it will *not* serve static files.