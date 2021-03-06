'use strict';

var path = require('path');
var utils = require('./utils');
var Item = require('./item');

/**
 * Expose `View`
 */

module.exports = View;

/**
 * Create an instance of `View`. Optionally pass a default object
 * to use.
 *
 * ```js
 * var view = new View({
 *   path: 'foo.html',
 *   content: '...'
 * });
 * ```
 * @param {Object} `view`
 * @api public
 */

function View(view) {
  if (!(this instanceof View)) {
    return new View(view);
  }

  Item.call(this, view);
  delete this.isItem;
  this.is('View');
}

/**
 * Inherit `Item`
 */

Item.extend(View);

/**
 * Creates a context object from front-matter data, `view.locals`
 * and the given `locals` object.
 *
 * ```js
 * var ctx = page.context({foo: 'bar'});
 * ```
 *
 * @param  {Object} `locals` Optionally pass locals to the engine.
 * @return {Object} Returns the context object.
 * @api public
 */

View.prototype.context = function(locals) {
  var args = [].concat.apply([], [].slice.call(arguments));
  var ctx = utils.merge({}, this.locals, this.data);
  args.unshift(ctx);
  return utils.merge.apply(utils.merge, args);
};

/**
 * Synchronously compile a view.
 *
 * ```js
 * var view = page.compile();
 * view.fn({title: 'A'});
 * view.fn({title: 'B'});
 * view.fn({title: 'C'});
 * ```
 *
 * @param  {Object} `locals` Optionally pass locals to the engine.
 * @return {Object} `View` instance, for chaining.
 * @api public
 */

View.prototype.compile = function(settings) {
  this.fn = utils.engine.compile(this.content, settings);
  return this;
};

/**
 * Asynchronously render a view.
 *
 * ```js
 * view.render({title: 'Home'}, function(err, res) {
 *   //=> view object with rendered `content`
 * });
 * ```
 * @param  {Object} `locals` Optionally pass locals to the engine.
 * @return {Object} `View` instance, for chaining.
 * @api public
 */

View.prototype.render = function(locals, cb) {
  if (typeof locals === 'function') {
    return this.render({}, locals);
  }

  // if the view is not already compiled, do that first
  if (typeof this.fn !== 'function') {
    this.compile(locals);
  }

  var context = this.context(locals);
  context.path = this.path;

  utils.engine.render(this.fn, context, function(err, res) {
    if (err) return cb(err);
    this.contents = new Buffer(res);
    cb(null, this);
  }.bind(this));
  return this;
};

/**
 * Return true if the view is the given view `type`. Since
 * types are assigned by collections, views that are "collection-less"
 * will not have a type, and thus will always return `false` (as
 * expected).
 *
 * ```js
 * view.isType('partial');
 * ```
 * @param {String} `type` (`renderable`, `partial`, `layout`)
 * @api public
 */

View.prototype.isType = function(type) {
  return this.viewType.indexOf(type) !== -1;
};

/**
 * Set the `viewType` on the view
 */

utils.define(View.prototype, 'viewType', {
  configurable: true,
  enumerable: true,
  get: function() {
    return utils.arrayify(this.options.viewType || 'renderable');
  }
});

/**
 * Return true if the viewType array has `renderable`
 */

utils.define(View.prototype, 'isRenderable', {
  get: function() {
    return this.isType('renderable');
  }
});

/**
 * Return true if the viewType array has `partial`
 */

utils.define(View.prototype, 'isPartial', {
  get: function() {
    return this.isType('partial');
  }
});

/**
 * Return true if the viewType array has `layout`
 */

utils.define(View.prototype, 'isLayout', {
  get: function() {
    return this.isType('layout');
  }
});

/**
 * Ensure that the `layout` property is set on a view.
 */

utils.define(View.prototype, 'layout', {
  set: function(val) {
    this.define('_layout', val);
  },
  get: function() {
    if (typeof this._layout !== 'undefined') {
      return this._layout;
    }
    this._layout = utils.resolveLayout(this);
    return this._layout;
  }
});

/**
 * Ensure that the `engine` property is set on a view.
 */

utils.define(View.prototype, 'engine', {
  set: function(val) {
    this.define('_engine', val);
  },
  get: function() {
    return this._engine || resolveEngine(this);
  }
});

/**
 * Resolve the name of the engine to use, or the file
 * extension to use for identifying the engine.
 *
 * @param {Object} `view`
 * @return {String}
 */

function resolveEngine(view) {
  var engine = view.options.engine || view.locals.engine || view.data.engine;
  if (!engine) {
    engine = path.extname(view.path);
    view.data.ext = engine;
  }
  if (engine) {
    return engine;
  }
}
