# redtail

## Installing and running

1. Install package dependencies: `npm install`.
2. Run the application: `npm start`.

By default, the server will start on port 3000. This can be overridden by
setting the `PORT` environment variable: `PORT=8080 npm start`.

## Scripts

Commands listed below can be run using the `npm run` command.
For example: `npm run build`.

### Building and cleaning

| Command        | Description                                                          |
|----------------|----------------------------------------------------------------------|
| `build`        | Build the application and its assets.                                |
| `build:client` | Use webpack to build the client application into the dist directory. |
| `build:server` | Use babel to build the server application into the app directory.    |
| `build:doc`    | Generate ESDoc into the doc directory.                               |
| `clean`        | Clean all build directories.                                         |

### Testing

| Command     | Description                                                           |
|-------------|-----------------------------------------------------------------------|
| `test`      | Run tests against the source code.                                    |
| `test:unit` | Run unit tests against the src directory.  Generates coverage report. |
| `test:lint` | Lint the Javascript code in the src directory.                        |

### Serving locally and watching

| Command | Description                                                                |
|---------|----------------------------------------------------------------------------|
| `watch` | Serve the application locally, and rebuild then restart when code changes. |
