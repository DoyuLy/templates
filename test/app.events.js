/* deps: mocha */
var path = require('path');
var assert = require('assert');
var should = require('should');
var Templates = require('../');
var app;

describe('events', function () {
  beforeEach(function () {
    app = new Templates();
  })

  it('should listen for an event:', function () {
    var app = new Templates();
    app.on('foo', function (val) {
    });
    assert(Array.isArray(app._callbacks['$foo']));
  });

  it('should emit an event:', function (done) {
    var app = new Templates();
    app.on('foo', function (val) {
      assert(val === 'bar');
      done();
    });
    assert(Array.isArray(app._callbacks['$foo']));
    app.emit('foo', 'bar');
  });

  it('should listen for error events:', function (done) {
    var app = new Templates();
    app.on('foo', function (val) {
      assert(val === 'bar');
      done();
    });
    assert(Array.isArray(app._callbacks['$foo']));
    app.emit('foo', 'bar');
  });
});