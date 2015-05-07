# RFLine

[![Build Status](https://travis-ci.org/dicksont/rfline.svg?branch=master)](https://travis-ci.org/dicksont/rfline) [![npm version](https://badge.fury.io/js/rfline.svg)](http://badge.fury.io/js/rfline)

RFLine is simple file line reader for Node.js.

[License](LICENSE) | [API Usage](API.md) | [Sample Apps](//github.com/dicksont/rfline-examples)

## Scenarios
### A. Counting lines

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

### B. Outputting Lines

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

### C. Error handling

Error handlers can be registered with the .error method. When an error occurs in the read pipeline, the error will be dispatched to these handlers.

#### - Example 1 -

```javascript
var reader = require('rfline').reader;

reader('this_does_not_exist.txt')
  .error(function(err) { console.log(err.toString()) })
  .finish();
```
