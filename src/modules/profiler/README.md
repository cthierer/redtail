# profiler

Contains code to profile the express application. The concept here is that the
only thing a developer should have to do is load the profiler before loading 
the express application, passing in the instrumentation that should be used.
The index.js file exposes the `load` function, as well as the instrumentation
loaders.

Instrumentation includes:

  * request-time: time the amount of time it takes for a request to execute
    from start-to-finish. This uses the `process.hrtime` function.

  * request-memory: _estimate_ the amount of memory that each request to the
    express application utilizes. This implementation is very inaccurate due 
    to how the event loop executes, and Node garbage collection. 

    Aysnchronous I/O events are deferred to the event loop, and Node may do 
    multiple operations on each tick of the loop, making it very difficult to 
    track memory consumption for a single request that spans multiple ticks.
    Garbage collection operations will also cleanup objects from the heap that
    are no longer referenced. Tying into garbage collection depends on either
    running the application with special flags to expose the garbage collector
    (meaning that the profiler is no longer "plug and play"), or including
    custom C modules. 

As a result, these instrumentations are very basic, and may not even be 
accurate. 

The profiler depends heavily on wrapping the internal workings of express to
hook into the middleware chain and monitor how the request is handled.
