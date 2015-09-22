'use strict';

var utils = require('../utils');

module.exports = function (proto, name) {

  /**
   * Format an error
   */

  proto.error = function(method, id, msg) {
    var ctx = this.errors[method][id];
    var reason = name + '#' + method + ' ' + ctx + (msg || '');
    var err = new Error(reason);
    err.reason = reason;
    err.id = id;
    err.msg = msg;
    return err;
  };

  /**
   * Rethrow an error in the given context to
   * get better error messages.
   */

  proto.rethrow = function(method, err, view, context) {
    try {
      utils.rethrow(view.content, {data: context, fp: view.path});
    } catch (msg) {
      err.method = method;
      err.reason = msg;
      err.id = 'rethrow';
      err._called = true;
      return err;
    }
  };
};