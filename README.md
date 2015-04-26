# RFLine

[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline)

RFLine is simple file line reader for Node.js.

[License](LICENSE) | [API Usage](API.md) 

## Scenarios
### A. Counting lines

#### - Example 1 

```javascript

var reader = require('rfline').reader;
var lineCount = 0;

reader('sonnet18.txt')
  .line(function() { lineCount++ })
  .finish(function() { console.log(lineCount) });

```

#### - Example 2 

```javascript

var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(function() { console.log(this.lineCount) });

```

### B. Outputting Lines

#### - Example 1

```javascript

var reader = require('rfline').reader;

reader('sonnet18.txt')
  .line(function(line) { console.log(line) })
  .finish();

```

#### - Example 2

```javascript

var reader = require('rfline').reader;

reader('sonnet18.txt')
  .finish(this.lines.map(function(line) { console.log(line) });

```
