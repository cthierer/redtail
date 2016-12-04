# redtail
> a data application

The redtail application tracks reports of rodents throughout Baltimore City,
and their proximity to local food establishments. The application pulls data
from three data sets on [Open Baltimore](https://data.baltimorecity.gov):

  * [Neighborhoods](https://data.baltimorecity.gov/dataset/nhood_2010/h3fx-54q3):
    all of the communities in the city, and their geographic details.

  * [Restaurants](https://data.baltimorecity.gov/resource/abuv-d2r2):
    used to populate the list of "establishments" tracked in the application.
    Includes restaurant name and location.

  * [311 Service Requests](https://data.baltimorecity.gov/resource/q7s2-a6pd):
    used to populate the list of "rodents" in the city by filtering down the
    data set to only those requests that mention rodents. Includes the location
    of the report, how the report was made, and the current state of the report.

Redtail aggregates this information together into a search-able, sortable
listing, and maps each rodent sighting and food establishment on a map using
coordinates pulled from the [US Census Geocoder](https://geocoding.geo.census.gov).
Maps are pulled from [Mapbox](https://www.mapbox.com/).

Users may also submit new rodent reports, edit existing reports, or delete
reports through the browser-based application, or through the REST API.

## Overview

The application includes two components:

  1. A browser-based application built on [Riot](http://riotjs.com/).
  2. A server-side application implemented using REST-ful concepts, built on
    [express](http://expressjs.com/).

The two applications are separate; however, for convenience while developing,
the express application serves the client application.

Source code is divided into modules, where each module is intended to
encapsulate all related (client and server) capabilities. The client and
server side share code, where applicable.

## Getting started

### Requirements

* Node 6.9
* MySQL 5.7

### Installing and running

To install and run locally:

  1. Install package dependencies: `npm install`.
  2. Create a MySQL database and user for the application to connect to. The
     user will need privileges to read and write data, and to create
     tables.
  3. Configure the database connection by either:
    1. Setting the following environment variables:
      * `DB_NAME`: the name of the database (defaults to "redtail")
      * `DB_USERNAME`: the name of the database user (defaults to "redtail")
      * `DB_PASSWORD`: the password for the database user (**required**)
      * `DB_HOST`: the server address (defaults to "localhost")
      * `DB_PORT`: the port to conenct to (defaults to 3306)
    2. Creating a "config/local.json" file, and including the following
      (replacing the appropriate values as needed):

      ```json
        {
          "models": {
            "db": {
              "database": "redtail",
              "username": "redtail",
              "password": "password",
              "options": {
                "host": "localhost",
                "port": 3306
              }
            }
          }
        }
      ```

  4. Initialize the database:
    1. From a database baseline (fast): `npm run bin:initData`.
    2. From Open Baltimore (slow): `npm run bin:refreshData`.
  5. Start the application: `npm start`.
  6. Open the application in a browser: http://localhost:3000.

### Serving on a different port

By default, the application is served on port 3000. This can be overridden by
setting the "PORT" environment variable:

```
%> PORT=8080 npm start
```

### Rebuilding the application

* Rebuild the entire application: `npm run build`.
* Rebuild only the client application: `npm run build:client`.
* Rebuild only the server application: `npm run build:server`.

The client application is built using [webpack](https://webpack.github.io/).

ES6 and ES7 code is compiled into browser-compatible and Node-compatible
Javascript using [babel](https://babeljs.io/).

### Logging

Redtail uses [bunyan](https://github.com/trentm/node-bunyan) for logging. The
default configuration writes "info" level logs to both stdout and a log file
("./redtail.log").

Bunyan writes logs in a JSON format, making it easy to search logs, but
difficult to read them. Log output can be piped through the
[Bunyan CLI](http://trentm.com/node-bunyan/bunyan.1.html) to pretty-print:

```
%> npm start | ./node_modules/.bin/bunyan
%> tail -f redtail.log | ./node_modules/.bin/bunyan
```

(To avoid referencing the node_modules directory, install bunyan globally:
`npm install -g bunyan`).

The Bunyan CLI also includes the ability to search logs for specific
conditions. For example, every request to the redtail server is given an
unique identifier, which is returned to the client in the `X-Request-Id` header.
To find all logs for a request with an ID of "A1234":

```
%> cat redtail.log | ./node_modules/.bin/bunyan -c 'this.reqId == "A1234"'
```

### Configuration

Redtail uses [nconfig](https://github.com/hyubs/nconfig) for configuration.
The default configuration file is set in "config/default.json". Local
applications can override defaults by setting the appropriate keys in a
"config/local.json" file, which is automatically merged with the default
configuration on application startup.

The server exposes a subset of the configuration to the client through the
`GET /config` endpoint.

## Instrumentation

The server component includes rudimentary instrumentation detailing the memory
and time it takes to process a request. Each server response includes a
`X-Instr-Tag` header, which can be traced back to the logs to lookup
instrumentation for that request:

```
%> cat redtail.log | ./node_modules/.bin/bunyan -c 'this.name == "profiler" && this.tag == "A1234"'
```

(The instrumentation tag is different from the request ID, even if they both
serve the same purpose - it just has to do with where the value is generated
in the execution flow.)

## Documentation

Source code is documented using [esdoc](https://esdoc.org/). The build source
code documentation is served through the server at "/docs".

## Unit testing

The application includes (limited) unit tests, which can be run using
`npm run test`.

Unit tests are run using the [mocha](https://mochajs.org/) framework, with
[chai](http://chaijs.com/) assertions, and [sinon](http://sinonjs.org/)
for spies, stubs, and mocks.

Test coverage reports are generated by
[istanbul](https://github.com/gotwarlost/istanbul), and are available through
the server at "/coverage".
