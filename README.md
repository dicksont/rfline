[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline) [![npm version](https://badge.fury.io/js/rfline.svg)](http://badge.fury.io/js/rfline)

*RFLine* is a Node.js library. It provides a simple but powerful abstraction for file iteration and slurping.


# Installation
### Node
You can use **npm** to install *RFLine* as follows:
```javascript
npm install rfline
```

From the interpreter, you can grab the *RFLine* *reader* function with:
```javascript
var reader = require('rfline').reader;
```

Reader enables you to progress through the file one line at a time. If you just want the contents of the file, you can grab the *slurp* function with:

```javascript
var slurp = require('rfline').slurp;
```

# Examples
## A. Counting lines in Shakespeare's *Sonnet 18*

#### - Example 1 -
The code below counts the number of lines in a text file. *Sonnet18.txt* contains Shakespeare's *Sonnet 18 : Shall I Compare Thee to a Summer's Day*. Since the number of lines in a sonnet is 16, this code should output 16.


```javascript
var reader = require('rfline').reader;
var lineCount = 0;

reader('sonnet18.txt')
  .line(function() { lineCount++ })
  .finish(function() { console.log(lineCount) }); //16
```

#### - Example 2 -
Here is another way to get the number of lines in a Shakespeare's *Sonnet 18*:

```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(function() { console.log(this.lineCount) }); //16
```

## B. Outputting Lines

#### - Example 1 -
We can also to print out Shakespeare's *Sonnet 18*:


```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .line(function(line) { console.log(line) })
  .finish();

/*
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:

Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance, or nature's changing course, untrimm'd;

But thy eternal summer shall not fade
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st;
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.
*/

```

#### - Example 2 -
By default, *RFLine* stores the lines of the file in an array. This array can be accessed from finish callback function, under the *lines* field of the *this* object. So we can also print out the *lines* of the file from the callback function, which gets called when *RFLine* has finished reading the file.


```javascript
var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(function() { this.lines.map(function(line) { console.log(line) }});

/*
Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:

Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance, or nature's changing course, untrimm'd;

But thy eternal summer shall not fade
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st;
So long as men can breathe or eyes can see,
So long lives this, and this gives life to thee.
*/


```


## C. Error handling

Handling errors can be tricky. To avoid unexpected silent errors, you should register a callback that handles these conditions. Error handlers can be registered with the .error method. When an error occurs in the read pipeline, the error will be dispatched to these functions.

```javascript
var reader = require('rfline').reader;

reader('this_does_not_exist.txt')
  .error(function(err) { console.log(err.toString()) })
  .finish();
```

We have built these examples into our regression test suite, but you can do much, much more. *RFLine* provides a powerful functional abstraction for file iteration.


You can try out some sample apps at the **[rfline-examples](//github.com/dicksont/rfline-examples)** repository.

# API Usage
RFLine exports two functions **reader** and **slurp**.

Use **reader** to process the file line-by-line.

Use **slurp** to retrieve the contents of the file with a single function call. **Slurp** is basically just a wrapper around **fs.readFile** and its synchronous cousin, **fs.readFileSync**.

## .slurp(filepath, [callback])
RFLine provides two ways to invoke this function. One is synchronous. The other is asynchronous. Both take as the first argument the path to the file. **Not the path to the  file is resolved relative to the location of interpreter and NOT the location of calling script. If you are unsure of what to use as the path to the file, I would recommend using the absolute path until you have worked things out.**

### Asynchronous invocation
To call read a file 'asynchronously', just pass in a callback as the second argument. Slurp will then invoke this callback when appropriate. The error if any will the first argument. The content of the file if any will be the second argument.

We will demonstrate how to output */etc/passwd* asynchronously:

```javascript
var rfline = require('rfline');

rfline.slurp('/etc/passwd', function(err, content) {

  if (err)
    console.log(err.message);

  if (content)
    console.log(content);

});
```


### Synchronous invocation
To read a file 'synchronously', omit the second argument. Slurp will return the content of the file if successful, or throw an error otherwise.

We will demonstrate how to output */etc/passwd*  synchronously:

```javascript
var rfline = require('rfline');

try {

  var content = rfline.slurp('/etc/passwd');
  console.log(content);

} catch (err) {

  console.log(err.message);

}
```

# .reader(filepath, [opts])
Pass in the filepath string to build a new reader. *Note filepath is resolved from the context of the interpreter and NOT the calling script.*

## opts
If you don't like the default options, you can pass in an **opts** object. This would affect the processing of the file. For example:

```javascript
reader(fixture.path, { 'capOnFinish' : false, 'saveState' : false })
```

The **opts** object that can have the following key value pairs:
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
3. cap the chain with an explicit **.cap** call.

## .cap()
End the reader construction chain, and execute. Most times you will be not need to call this explicitly. It will be called
implicitly for you during **.finish** unless **opts.capOnFinish** is set to false.


# License
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
