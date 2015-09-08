var path = require('path');
var assert = require('assert');
require('mocha');
require('should');
var View = require('../lib/view');
var view;

describe.skip('helpers', function () {
  describe('rendering', function () {
    beforeEach(function () {
      view = new View();
    });

    it('should expose `.render` for rendering a view:', function (done) {
      app.pages('a.tmpl', {path: 'a.tmpl', content: '<%= a %>'})
        .render({a: 'bbb'}, function (err, res) {
          if (err) return done(err);
          res.contents.toString().should.equal('bbb');
          done();
        });
    });

    it('should use helpers to render a view:', function (done) {
      var locals = {name: 'Halle'};

      view.helper('upper', function (str) {
        return str.toUpperCase(str);
      });

      var buffer = new Buffer('a <%= upper(name) %> b')
      view.page('a.tmpl', {contents: buffer, locals: locals})
        .render(function (err, res) {
          if (err) return done(err);

          assert(res.contents.toString() === 'a HALLE b');
          done();
        });
    });
  });
});

