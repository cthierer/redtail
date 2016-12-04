# test 

Contains tests designed to verify the application code.

The entry.js script should be run before any unit tests. This script handles
loading loading Babel, which is required to run the tests against the
un-bulit source code. It also handles setting configuration values, such
as disabling logging. On Mocha, this can be done using the `--require` flag:

```
%> mocha --require ./test/entry --recursive ./test/unit
```

The expect.js script handles loading the Chai assertion library, and several
common plugins for the library for working with Promises and Sinon. Tests may 
chose to import this script, which exports the conifugured `expect` assertion
function. 
