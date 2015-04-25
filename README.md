# RFLine

[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline)

RFLine is simple file line reader for Node.js.


```javascript

var reader = require('rfline').reader;
var lineCount = 0;

reader('sonnet18.txt', { 'saveState' : false })
  .line(function() { lineCount++ })
  .read(function() { console.log(lineCount) });
  
```
