'use strict';

var utils = require('../utils');

/**
 * Default methods and settings that will be decorated onto
 * each collection.
 */

module.exports = function(proto) {

  /**
   * Apply a layout to the given `view`.
   *
   * @name .applyLayout
   * @param  {Object} `view`
   * @return {Object} Returns a `view` object.
   */

  proto.applyLayout = function(view) {
    if (view.options.layoutApplied) {
      return view;
    }

    // handle pre-layout middleware
    this.handle('preLayout', view);

    // get the layout stack
    var stack = {}, registered = 0;
    var alias = this.viewTypes.layout;
    var len = alias.length, i = 0;

    while (len--) {
      var views = this.views[alias[i++]];
      for (var key in views) {
        stack[key] = views[key];
        registered++;
      }
    }

    // get the name of the first layout
    var self = this;
    var name = view.layout;
    var str = view.content;

    // if no layout is defined, move on
    if (typeof name === 'undefined') {
      return view;
    }

    if (registered === 0 || !stack.hasOwnProperty(name)) {
      throw this.error('layouts', 'registered', name);
    }

    var opts = {};
    utils.extend(opts, this.options);
    utils.extend(opts, view.options);
    utils.extend(opts, view.context());

    // Handle each layout before it's applied to a view
    function handleLayout(obj, stats/*, depth*/) {
      view.currentLayout = obj.layout;
      view.define('layoutStack', stats.history);
      self.handle('onLayout', view);
      delete view.currentLayout;
    }

    // actually apply the layout
    var res = utils.layouts(str, name, stack, opts, handleLayout);
    if (res.result === str) {
      throw new Error('layout was not applied to: ' + view.path);
    }

    view.option('layoutApplied', true);
    view.option('layoutStack', res.history);
    view.contents = new Buffer(res.result);

    // handle post-layout middleware
    this.handle('postLayout', view);
    return view;
  };
};