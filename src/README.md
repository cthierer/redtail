# source code

Includes all source code for the Javascript application. (HTML and SASS
are located in the site directory.)

* ./server.js serves as the entry point for the express application. It loads
  all of the required modules, and mounts the individual module routers.

* ./client.js pulls in depedencies and configures the client application. It 
  loads all of the required modules, configures the client-side router, and
  loads global mixins and helpers.

* ./bin contains scripts meant to be run from the command-line.

* ./modules contains the individual modules for the application. (See "Modules
  Concept" section below.)

* ./tags contains the Riot tags specific to Redtail (ex., header, footer). 
  Modules may define additional tags that are either referenced within these
  tags, or mounted via the client router (configured in client.js).

## Modules concept

The idea is to separate the application into stand-along modules. The "core"
module contains common components shared across all modules. Other modules are
designed to be shared as-needed, such as the "logger", "filter", and "utils"
modules.

Each "entity" in the application is also its own module ("neighborhoods", 
"rodents", "establishments", etc.). These modules define the routers, actions,
and tags needed to do perform CRUD operations on each entity.

## Code structure

* "actions" perform operations on data models, and are mainly used by the 
  Riot tags to separate "doing things" from presentation. (This also helps with
  unit testing, since Riot tags are not generally unit testable themselves,
  but standalone action functions are.)

* "middleware" are express middleware functions that can be mounted on routes
  in the router. They are intended to be fairly small, an to fire in combination
  to achieve complex tasks.

* "tags" are the core components of the client application. They render the
  application and react to data events and user actions. Each "tags" directory
  includes an index file that handles configuring the routes and mixins
  required for those tags. 

* "utils" are re-usable functions for common operations. They never modify state.

## State management 

The client and the server both maintain a state during execution. On the server,
as middleware fires, it will update the `req.ctx` (request context)`, which other
middleware functions may build on and eventually return to the caller. On the
client, state tracks user filters and data objects currently in-scope. A global
state is passed to the top-level tag when it is mounted, which is then passed
down to child-tags as appropriate.

The state model used here is home-grown, and is one area that could benefit from
refactoring or replacing with an existing state management framework.
