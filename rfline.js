/*
 * Copyright (c) 2015 Dickson Tam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */

var fs = require('fs');
var path = require('path');
var extend = require('extend');

function RFLine(fpath, opts) {
  var cb = this.cb = {};

  this.opts = extend({
    'saveState' : true
  }, opts);

  ['line', 'finish', 'error'].map(function(event) { cb[event] = [] });

  this.on('line', function(line) {
    if (this.opts.saveState) {
      this.lineCount++;
      this.lines.push(line);
    }

  });

  this.on('error', function(err) { throw err; });

  this.stream = fs.createReadStream(fpath, {encoding: 'utf8'});
}

RFLine.prototype.read = function(cbFinish) {

  var reader = this;
  var line = "";

  /* A stream can only be read once */
  if (reader.hasOwnProperty('lineCount'))
    return this;


  if (typeof(cbFinish) == 'undefined')
    console.warn('Callback function missing from read invocation');

  if (this.opts.saveState) {
    reader.lineCount = 0;
    reader.lines = [];
  }


  reader.on('finish', cbFinish);

  function cbData(sfrag) {
    if (!~sfrag.indexOf("\n")) {
      line += sfrag;
    } else {
      var lines = sfrag.split("\n");
      lines[0] = line + lines[0];

      for (var i=0; i < lines.length -1; i++) {
        reader.trigger('line', lines[i]);
      }

      line = lines[i];
    }
  }

  try {
    reader.stream
      .on('data', cbData)
      .on('end', function() {
        if (line.length > 0) reader.trigger('line', line);
        reader.trigger('finish');
      });
  } catch (err) {
    reader.trigger('error', err);
  }

  return reader;
}

RFLine.prototype.line = function(cb) {
  this.on('line', cb);
  return this;
}

RFLine.prototype.error = function(cb) {
  this.on('error', cb);
  return this;
}

RFLine.prototype.on = function(event, cb) {
  this.cb[event].push(cb.bind(this));
  return this;
}

RFLine.prototype.trigger = function(event, arg) {
  this.cb[event].map(function(cb) { typeof(arg) == 'undefined'? cb() : cb(arg); });
  return this;
}

RFLine.reader = function(fpath, opts) {
  return new RFLine(fpath, opts);
};

RFLine.reader.class = RFLine;

module.exports = RFLine;
