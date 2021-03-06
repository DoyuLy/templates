'use strict';

require('mocha');
require('should');
var assert = require('assert');
var support = require('./support');
var App = support.resolve();
var utils = App.utils;

describe('utils', function() {
  describe('formatExt', function() {
    it('should ensure that file extension is preceded by a dot:', function() {
      assert(utils.formatExt('.js') === '.js');
      assert(utils.formatExt('js') === '.js');
    });

    it('should throw an error when not a string:', function() {
      (function() {
        utils.formatExt();
      }).should.throw('utils.formatExt() expects `ext` to be a string.');
    });
  });

  describe('getLocals', function() {
    it('should get locals from an object:', function() {
      var a = {foo: 'bar', hash: {one: 'two'}};
      var b = {baz: 'qux', hash: {three: 'four'}};

      assert.deepEqual(utils.getLocals(a, b), {
        three: 'four',
        one: 'two',
        baz: 'qux',
        foo: 'bar'
      });
    });

    it('should no blow up when first arg is null:', function() {
      var b = {baz: 'qux', hash: {three: 'four'}};

      assert.deepEqual(utils.getLocals(null, b), {
        three: 'four',
        baz: 'qux'
      });
    });

    it('should no blow up when second arg is null:', function() {
      var a = {foo: 'bar', hash: {one: 'two'}};

      assert.deepEqual(utils.getLocals(a, null), {
        one: 'two',
        foo: 'bar'
      });
    });
  });

  describe('isView', function() {
    it('should return true if a value looks like a view:', function() {
      assert(utils.isView({a: 'b', c: 'd', contents: '...'}));
      assert(utils.isView({a: 'b', c: 'd', content: '...'}));
      assert(utils.isView({a: 'b', c: 'd', path: '...'}));
    });

    it('should return false if a value is not a view:', function() {
      assert(!utils.isView({a: 'b', c: 'd'}));
      assert(!utils.isView('foo'));
    });
  });
});

