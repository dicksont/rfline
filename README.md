# RFLine

[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline) [![npm version](https://badge.fury.io/js/rfline.svg)](http://badge.fury.io/js/rfline)

RFLine a Node.js library. It provides a powerful by simple abstraction for reading files line-by-line or in one fell swoop.

[License](LICENSE) | [Sample Apps](//github.com/dicksont/rfline-examples)

# Installation
### Node
You can use npm to install rfline. Start by typing into your shell the following:
```javascript
npm install rfline
```

Then, in your app, you can import the RFLine reader function with:
```javascript
var reader = require('rfline').reader;
```

You can also import the slurp function with:

```javascript
var slurp = require('rfline').slurp;
```

This two functions will give you access to all the functionality stored within the RFLine library.

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

# API Usage
RFLine exports two functions **reader** and **slurp**.

Use **reader** to process the file line-by-line.

Use **slurp** to output the contents of the file in one fell swoop. **Slurp** is basically just a wrapper around **fs.readFile** and its synchronous cousin, **fs.readFileSync**.

## .slurp(filepath, [callback])
Pass in the filepath string to build a new reader. *Be aware filepath is evaluated from the context of the interpreter and NOT the calling script.*

If a callback is passed in, then the operation would be asynchronous. *fs.readFile* would be used, and the callback would be called on the the return. The content of the file would be passed as an argument to the callback.

Otherwise, *fs.readFileSync* would be used. The operation would be synchronous. And the return value would be the content of the file.

# .reader(filepath, [opts])
Pass in the filepath string to build a new reader. *Note filepath is evaluated from the context of the interpreter and NOT the calling script.*

## opts
If you don't like the default options, you can pass in an opts object, which would affect the processing of the file. For example:

```javascript
reader(fixture.path, { 'capOnFinish' : false, 'saveState' : false })
```

The opts object that can have the following key value pairs:
#### capOnFinish
*Default: true*

Calling finish caps the chain. Set this to false, if you want to use more than one finish callback in your processing pipeline. You will have to call cap explictly at the end, however. Otherwise, the file will never be read.

#### saveState
*Default: true*

RFLine by default, saves certain state during the processing of the file. This includes the lines and number of lines read. Normally, this information is moderately useful, but in some cases, this behavior can be problematic. For example, if you are using RFLine to read a very large file, you might want to set this to false. Otherwise, your process might run out of memory.

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
