[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline) [![npm version](https://badge.fury.io/js/rfline.svg)](http://badge.fury.io/js/rfline)

RFLine is a Node.js library. It provides a simple but powerful abstraction for reading files line-by-line or in one fell swoop.



# Installation
### Node
You can use npm to install RFLine. Start by typing into your shell the following:
```javascript
npm install rfline
```

Then, in your app, you can acquire the RFLine reader function with:
```javascript
var reader = require('rfline').reader;
```

and the slurp function with:

```javascript
var slurp = require('rfline').slurp;
```

This two functions will give you access to all the features within the RFLine library.

# Cookbook & Examples
## A. Counting lines

RFLine is very versatile. Below are two equally valid ways of returning the number of lines in a file.

#### - Example 1 -

```javascript
var reader = require('rfline').reader;
var lineCount = 0;

reader('sonnet18.txt')
  .line(function() { lineCount++ })
  .finish(function() { console.log(lineCount) });
```

#### - Example 2 -

```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(function() { console.log(this.lineCount) });
```

## B. Outputting Lines

Printing the number of lines can also be done in more than one way:

#### - Example 1 -

```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .line(function(line) { console.log(line) })
  .finish();
```

#### - Example 2 -

```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(function() { this.lines.map(function(line) { console.log(line) }});
```

## C. Error handling

Error handlers can be registered with the .error method. When an error occurs in the read pipeline, the error will be dispatched to these handlers.

```javascript
var reader = require('rfline').reader;

reader('this_does_not_exist.txt')
  .error(function(err) { console.log(err.toString()) })
  .finish();
```

You can try out some sample apps at my [rfline-examples repository](//github.com/dicksont/rfline-examples).

# API Usage
RFLine exports two functions **reader** and **slurp**.

Use **reader** to process the file line-by-line.

Use **slurp** to retrieve the contents of the file in one fell swoop. **Slurp** is basically just a wrapper around **fs.readFile** and its synchronous cousin, **fs.readFileSync**.

## .slurp(filepath, [callback])
Pass in the filepath string to build a new reader. *Be aware filepath is evaluated from the context of the interpreter and NOT the calling script.*

If a callback is passed in, then the operation would be asynchronous. *fs.readFile* would be used, and the callback would be called on the the return. The content of the file would be passed as an argument to the callback.

Otherwise, *fs.readFileSync* would be used. The operation would be synchronous. And the return value would be the content of the file.

# .reader(filepath, [opts])
Pass in the filepath string to build a new reader. *Note filepath is evaluated from the context of the interpreter and NOT the calling script.*

## opts
If you don't like the default options, you can pass in an opts object. This would affect the processing of the file. For example:

```javascript
reader(fixture.path, { 'capOnFinish' : false, 'saveState' : false })
```

The opts object that can have the following key value pairs:
#### capOnFinish
*Default: true*

Calling **.finish** caps the chain. Set this to false, if you want to use more than one finish callback in your processing pipeline. You will have to call **.cap** explictly at the end, however. Otherwise, the file will never be read.

#### saveState
*Default: true*

RFLine by default saves some state during the processing of the file. This includes the lines and number of lines read. Most of the time, this information is somewhat useful, but in some cases, this behavior can be problematic. For example, if you are using RFLine to read a very large file, you might want to set this to false. Otherwise, your process might run out of memory.

## .line(cb)
Add the following callback to the list of functions to be called when the reader has determined the next line. The callback receives a line argument that holds the current line.

Lines are guaranteed and sequential.


## .finish(cb)
This method allows the developer to specify the callback RFLine will use to do processing at the end of the file. This callback can operate on states stored by RFLine during the processing like **this.lines** or **this.lineCount**.

This method adds the callback to the finish dispatch chain.

It will also call **.cap** to execute the chain if **opts.capOnFinish** is true.
This is the default behavior.

If you want, set additional callbacks to be executed on finish, then you should:

1. set **opts.capOnFinish** to false,
2. call **.finish** as many times as you need,
3. and cap the chain with an explicit **.cap** call.

## .cap()
End the reader construction chain, and execute. Most times you will be not need to call this explicitly. It will be called
implicitly for you during **.finish** unless **opts.capOnFinish** is set to false.


## License
The MIT License (MIT)

Copyright (c) 2015 Dickson Tam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
