'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var app;

describe('app.events', function() {
  beforeEach(function() {
    app = new App();
  });

  it('should listen for an event:', function() {
    var app = new App();
    app.on('foo', function() {});
    assert(Array.isArray(app._callbacks['$foo']));
  });

  it('should emit an event:', function(cb) {
    var app = new App();
    app.on('foo', function(val) {
      assert(val === 'bar');
      cb();
    });
    assert(Array.isArray(app._callbacks['$foo']));
    app.emit('foo', 'bar');
  });

  it('should listen for `view` events:', function() {
    app = new App();

    app.on('view', function(view) {
      view.foo = 'bar';
    });

    var view = app.view({path: 'a', content: 'b'});
    assert(view.foo === 'bar');
  });
});

describe('onLoad', function() {
  beforeEach(function() {
    app = new App();
  });

  describe('app.collection', function() {
    it('should emit a `view` event when view is created', function(cb) {
      var collection = app.collection();

      app.on('view', function(view) {
        assert(view.path === 'blog/foo.js');
        cb();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      collection.addView('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });

    it('should emit an onLoad event when view is created', function(cb) {
      var collection = app.collection();

      app.on('onLoad', function(view) {
        assert(view.path === 'blog/foo.js');
        cb();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      collection.addView('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });

    it('should not emit an onLoad event when view is created and `app.options.onLoad` is `false', function(cb) {
      var emitted = false;
      var handled = false;
      var collection = app.collection();
      app.options.onLoad = false;

      app.on('onLoad', function(view) {
        emitted = true;
      });

      app.onLoad('blog/:title', function(view, next) {
        handled = true;
        next();
      });

      collection.addView('whatever', {path: 'blog/foo.js', content: 'bar baz'});
      setImmediate(function() {
        assert.equal(typeof collection.views.whatever, 'object');
        assert.equal(emitted, false);
        assert.equal(handled, false);
        cb();
      });
    });

    it('should not emit an onLoad event when view is created and `collection.options.onLoad` is `false', function(cb) {
      var emitted = false;
      var handled = false;
      var collection = app.collection();
      collection.options.onLoad = false;

      app.on('onLoad', function(view) {
        emitted = true;
      });

      app.onLoad('blog/:title', function(view, next) {
        handled = true;
        next();
      });

      collection.addView('whatever', {path: 'blog/foo.js', content: 'bar baz'});
      setImmediate(function() {
        assert.equal(typeof collection.views.whatever, 'object');
        assert.equal(emitted, false);
        assert.equal(handled, false);
        cb();
      });
    });

    it('should not emit an onLoad event when view is created and `view.options.onLoad` is `false', function(cb) {
      var emitted = false;
      var handled = false;
      var collection = app.collection();

      app.on('onLoad', function(view) {
        emitted = true;
      });

      app.onLoad('blog/:title', function(view, next) {
        handled = true;
        next();
      });

      collection.addView('whatever', {
        options: {
          onLoad: false
        },
        path: 'blog/foo.js',
        content: 'bar baz'
      });

      setImmediate(function() {
        assert.equal(typeof collection.views.whatever, 'object');
        assert.equal(emitted, false);
        assert.equal(handled, false);
        cb();
      });
    });
  });

  describe('view collections', function() {
    it('should emit a view event when view is created', function(cb) {
      app.create('posts');

      app.on('view', function(view) {
        assert(view.path === 'blog/foo.js');
        cb();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      app.post('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });

    it('should emit an onLoad event when view is created', function(cb) {
      app.create('posts');

      app.on('onLoad', function(view) {
        assert(view.path === 'blog/foo.js');
        cb();
      });

      app.onLoad('blog/:title', function(view, next) {
        assert(view.path === 'blog/foo.js');
        next();
      });

      app.post('whatever', {path: 'blog/foo.js', content: 'bar baz'});
    });
  });
});
