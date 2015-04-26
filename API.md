# API

## .reader(filepath)
Pass in the filepath to build a new reader. 

### .cap()
End the reader construction chain, and execute. Most times you will be not need to call this explicitly. It will be called
implicitly for you unless opts.capOnFinish is set to false.

### .finish(cb)
Add the callback to the finish dispatch chain. Callbacks in chain will be processed when the reader finishes.

It will also call *.cap* if *opts.capOnFinish* is true.
This is the default behavior.

If you want, set additional callbacks to be executed on finish, then you should:

1. set *opts.capOnFinish* to false,
2. call *.finish* as many times as you need,
3. and cap the chain with an explicit call.

### .line(cb)
Add the following callback to be called when the reader has determined the next line. The callback can take a line parameter,
which holds the current line.

Lines are guaranteed and sequential.

