# RFLine

[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline)

RFLine is simple file line reader for Node.js.


### Line count example

```javascript

var reader = require('rfline').reader;
var lineCount = 0;

reader('sonnet18.txt')
  .line(function() { lineCount++ })
  .finish(function() { console.log(lineCount) });

```


