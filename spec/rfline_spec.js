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

var assert = require('assert');
var reader = require('../rfline.js').reader;
var path = require('path');


var sonnet18 = {
  label: 'Shakespeare - Sonnet 18',
  path: path.resolve(__dirname, 'sonnet18.txt'),
  lineCount: 16
};

var libai = {
  label: '李白 - 靜夜思',
  path: path.resolve(__dirname, 'libai.txt'),
  lineCount: 5
};


[sonnet18, libai].map(function(fixture) {
  describe('RFLine [' + fixture.label + "]", function(){
    describe('.reader', function(){


      it('should return a new LineReader for valid paths', function() {
        assert.ok(reader(fixture.path) instanceof reader.class);
      });

      it('should return a new LineReader for valid paths', function() {
        assert.ok(reader(fixture.path) instanceof reader.class);
      });
    })

    describe('.read', function(){
      it('should save state by default', function(done) {
        reader(fixture.path)
          .finish(function() {
            assert.notEqual(typeof(this.lines), 'undefined');
            assert.notEqual(typeof(this.lineCount), 'undefined');
            done();
          });
      });
      it('should not save any state when stateless', function(done) {
        reader(fixture.path, { 'saveState' : false })
          .finish(function() {
            assert.equal(typeof(this.lines), 'undefined');
            assert.equal(typeof(this.lineCount), 'undefined');
            done();
          });
      });
    });

    describe('.lineCount', function(){
      it('should count ' + fixture.lineCount + ' lines', function(done) {
        reader(fixture.path)
          .finish(function() {
            assert.equal(this.lineCount, fixture.lineCount);
            done();
          });


      });
    });

    describe('.line', function() {
      var recordedLines = [];

      it('should read the same ' + fixture.lineCount + ' lines', function(done) {
        reader(fixture.path)
          .line(function(line) {
            recordedLines.push(line);
          })
          .finish(function() {
            assert.equal(this.lineCount, recordedLines.length);
            for (var i=0; i < this.lineCount; i++) {
              assert.equal(this.lines[i], recordedLines[i]);
            }
            done();
          });
      });

      it('should count ' + fixture.lineCount + ' lines statelessly', function(done) {
        var lineCount = 0;
        reader(fixture.path, { 'saveState' : false })
          .line(function() { lineCount++ })
          .finish(function() {
            assert.equal(lineCount, fixture.lineCount);
            done();
          });
      });
    });


  })
});
