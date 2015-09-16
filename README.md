# templates [![NPM version](https://badge.fury.io/js/templates.svg)](http://badge.fury.io/js/templates)

> System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i templates --save
```

## Usage

```js
var templates = require('templates');
```

# API

### [Templates](index.js#L32)

This function is the main export of the templates module. Initialize an instance of `templates` to create your application.

**Params**

* `options` **{Object}**

**Example**

```js
var templates = require('templates');
var app = templates();
```

### [.use](index.js#L145)

Run a plugin on the instance. Plugins are invoked immediately upon creating the collection in the order in which they were defined.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each collection created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```
var app = assemble()
  .use(require('foo'))
  .use(require('bar'))
  .use(require('baz'))
```

### [.view](index.js#L169)

Returns a new view, using the `View` class currently defined on the instance.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` object

**Example**

```js
var view = app.view('foo', {conetent: '...'});
// or
var view = app.view({path: 'foo', conetent: '...'});
```

### [.data](index.js#L186)

Set, get and load data to be passed to templates as context at render-time.

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
---

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.    
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.    
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.  

### [.collection](index.js#L228)

Create a new view collection. View collections are decorated with special methods for getting, setting and rendering views from that collection. Collections created with this method are not stored on `app.views` as with the [create](#create) method.

**Params**

* `opts` **{Object}**: Collection options    
* `returns` **{Object}**: Returns the `collection` instance for chaining.  

**Example**

```js
var collection = app.collection();
collection.addViews({...}); // add an object of views
collection.addView('foo', {content: '...'}); // add a single view

// collection methods are chainable too
collection.addView('home.hbs', {content: 'foo <%= title %> bar'})
  .render({title: 'Home'}, function(err, res) {
    //=> 'foo Home bar'
  });
```

### [.create](index.js#L273)

Create a new view collection that is stored on the `app.views` object. For example, if you create a collection named `posts`, then all `posts` will be stored on `app.views.posts`, and a `posts` method will be added to `app`, allowing you to add posts to the collection using `app.posts()`.

**Params**

* `name` **{String}**: The name of the collection. Plural or singular form.
* `opts` **{Object}**: Collection options
* `loaders` **{String|Array|Function}**: Loaders to use for adding views to the created collection.
* `returns` **{Object}**: Returns the `collection` instance for chaining.

**Example**

```js
app.create('posts');
app.posts({...}); // add an object of views
app.post('foo', {content: '...'}); // add a single view

// collection methods are chainable too
app.post('home.hbs', {content: 'foo <%= title %> bar'})
  .render({title: 'Home'}, function(err, res) {
    //=> 'foo Home bar'
  });
```

### [.find](index.js#L413)

Find a view by `name`, optionally passing a `collection` to limit the search. If no collection is passed all `renderable` collections will be searched.

**Params**

* `name` **{String}**: The name/key of the view to find
* `colleciton` **{String}**: Optionally pass a collection name (e.g. pages)
* `returns` **{Object|undefined}**: Returns the view if found, or `undefined` if not.

**Example**

```js
var page = app.find('my-page.hbs');

// optionally pass a collection name as the second argument
var page = app.find('my-page.hbs', 'pages');
```

### [.getView](index.js#L451)

Get view `key` from the specified `collection`.

**Params**

* `collection` **{String}**: Collection name, e.g. `pages`
* `key` **{String}**: Template name
* `fn` **{Function}**: Optionally pass a `renameKey` function
* `returns` **{Object}**

**Example**

```js
var view = app.getView('pages', 'a/b/c.hbs');

// optionally pass a `renameKey` function to modify the lookup
var view = app.getView('pages', 'a/b/c.hbs', function(fp) {
  return path.basename(fp);
});
```

### [.getViews](index.js#L490)

Get all views from a `collection` using the collection's singular or plural name.

**Params**

* `name` **{String}**: The collection name, e.g. `pages` or `page`
* `returns` **{Object}**

**Example**

```js
var pages = app.getViews('pages');
//=> { pages: {'home.hbs': { ... }}

var posts = app.getViews('posts');
//=> { posts: {'2015-10-10.md': { ... }}
```

### [.matchView](index.js#L522)

Returns the first view from `collection` with a key that matches the given glob pattern.

**Params**

* `collection` **{String}**: Collection name.
* `pattern` **{String}**: glob pattern
* `options` **{Object}**: options to pass to [micromatch](https://github.com/jonschlinkert/micromatch)
* `returns` **{Object}**

**Example**

```js
var pages = app.matchView('pages', 'home.*');
//=> {'home.hbs': { ... }, ...}

var posts = app.matchView('posts', '2010-*');
//=> {'2015-10-10.md': { ... }, ...}
```

### [.matchViews](index.js#L550)

Returns any views from the specified collection with keys that match the given glob pattern.

**Params**

* `collection` **{String}**: Collection name.
* `pattern` **{String}**: glob pattern
* `options` **{Object}**: options to pass to [micromatch](https://github.com/jonschlinkert/micromatch)
* `returns` **{Object}**

**Example**

```js
var pages = app.matchViews('pages', 'home.*');
//=> {'home.hbs': { ... }, ...}

var posts = app.matchViews('posts', '2010-*');
//=> {'2015-10-10.md': { ... }, ...}
```

### [.handle](index.js#L592)

Handle a middleware `method` for `view`.

**Params**

* `method` **{String}**: Name of the router method to handle. See [router methods](./docs/router.md)
* `view` **{Object}**: View object
* `callback` **{Function}**: Callback function
* `returns` **{Object}**

**Example**

```js
app.handle('customMethod', view, callback);
```

### [.route](index.js#L681)

Create a new Route for the given path. Each route contains a separate middleware stack.

See the [route API documentation][route-api] for details on
adding handlers and middleware to routes.

**Params**

* `path` **{String}**
* `returns` **{Object}** `Route`: for chaining

**Example**

```js
app.create('posts');
app.route(/blog/)
  .all(function(view, next) {
    // do something with view
    next();
  });

app.post('whatever', {path: 'blog/foo.bar', content: 'bar baz'});
```

### [.all](index.js#L703)

Special route method that works just like the `router.METHOD()` methods, except that it matches all verbs.

**Params**

* `path` **{String}**
* `callback` **{Function}**
* `returns` **{Object}** `this`: for chaining

**Example**

```js
app.all(/\.hbs$/, function(view, next) {
  // do stuff to view
  next();
});
```

### [.param](index.js#L732)

Add callback triggers to route parameters, where `name` is the name of the parameter and `fn` is the callback function.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{Object}**: Returns the instance of `Templates` for chaining.

**Example**

```js
app.param('title', function (view, next, title) {
  //=> title === 'foo.js'
  next();
});

app.onLoad('/blog/:title', function (view, next) {
  //=> view.path === '/blog/foo.js'
  next();
});
```

### [.engine](index.js#L759)

Register a view engine callback `fn` as `ext`.

**Params**

* `exts` **{String|Array}**: String or array of file extensions.
* `fn` **{Function|Object}**: or `settings`
* `settings` **{Object}**: Optionally pass engine options as the last argument.

**Example**

```js
app.engine('hbs', require('engine-handlebars'));

// using consolidate.js
var engine = require('consolidate');
app.engine('jade', engine.jade);
app.engine('swig', engine.swig);

// get a registered engine
var swig = app.engine('swig');
```

### [.compile](index.js#L892)

Compile `content` with the given `locals`.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Load async helpers
* `returns` **{Object}**: View object with `fn` property with the compiled function.

**Example**

```js
var indexPage = app.page('some-index-page.hbs');
var view = app.compile(indexPage);
// view.fn => [function]

// you can call the compiled function more than once
// to render the view with different data
view.fn({title: 'Foo'});
view.fn({title: 'Bar'});
view.fn({title: 'Baz'});
```

### [.render](index.js#L955)

Render a view with the given `locals` and `callback`.

**Params**

* `view` **{Object|String}**: Instance of `View`
* `locals` **{Object}**: Locals to pass to template engine.
* `callback` **{Function}**

**Example**

```js
var blogPost = app.post.getView('2015-09-01-foo-bar');
app.render(blogPost, {title: 'Foo'}, function(err, view) {
  // `view` is an object with a rendered `content` property
});
```

## Collections

### [Views](lib/views.js#L17)

Create an instance of `Views` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Views();
collection.addView('foo', {content: 'bar'});
```

### [.use](lib/views.js#L75)

Run a plugin on the collection instance. Plugins are invoked immediately upon creating the collection in the order in which they were defined.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each view created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
collection.use(function(views) {
  // `views` is the instance, as is `this`

  // optionally return a function to be passed to
  // the `.use` method of each view created on the
  // instance
  return function(view) {
    // do stuff to each `view`
  };
});
```

### [.view](lib/views.js#L99)

Returns a new view, using the `View` class currently defined on the instance.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` object

**Example**

```js
var view = app.view('foo', {conetent: '...'});
// or
var view = app.view({path: 'foo', conetent: '...'});
```

### [.setView](lib/views.js#L114)

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` instance.

**Example**

```js
collection.setView('foo', {content: 'bar'});
```

### [.addView](lib/views.js#L128)

Adds event emitting and custom loading to [setView](#setView).

**Params**

* `key` **{String}**
* `value` **{Object}**

### [.addViews](lib/views.js#L154)

Load multiple views onto the collection.

**Params**

* `views` **{Object|Array}**
* `returns` **{Object}**: returns the `collection` object

**Example**

```js
collection.addViews({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### [.addList](lib/views.js#L184)

Load an array of views onto the collection.

**Params**

* `views` **{Object|Array}**
* `returns` **{Object}**: returns the `collection` object

**Example**

```js
collection.addViews([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### [.getView](lib/views.js#L211)

Get a view from the collection.

**Params**

* `key` **{String}**: Key of the view to get.
* `returns` **{Object}**

**Example**

```js
collection.getView('a.html');
```

## List

### [.groupBy](lib/list.js#L114)

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### [.sortBy](lib/list.js#L140)

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### [.paginate](lib/list.js#L174)

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```

### [.pagination](lib/list.js#L209)

Getter for returning an array of pagination objects for each list item. Useful when you just want `prev/next` type information.

* `returns` **{Array}**: Returns the array of pagination pages.

**Example**

```js
var list = new List([
  {name: 'one'},
  {name: 'two'},
  {name: 'three'}
]);

var pages = list.pages;
// [
//  {idx: 0, current: 1, next: 2, item: {name: 'one'}},
//  {idx: 1, current: 2, next: 3, prev: 1, item: {name: 'two'}},
//  {idx: 2, current: 3, prev: 2, item: {name: 'three'}}
// ]
```

## View

### [.use](lib/view.js#L76)

Run a plugin on the `view` instance.

**Params**

* `fn` **{Function}**
* `returns` **{Object}**

**Example**

```js
var view = new View({path: 'abc', contents: '...'})
  .use(require('foo'))
  .use(require('bar'))
  .use(require('baz'))
```

### [.compile](lib/view.js#L96)

Synchronously compile a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
var view = page.compile();
view.fn({title: 'A'});
view.fn({title: 'B'});
view.fn({title: 'C'});
```

### [.render](lib/view.js#L114)

Asynchronously render a view.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}** `View`: instance, for chaining.

**Example**

```js
view.render({title: 'Home'}, function(err, res) {
  //=> view object with rendered `content`
});
```

### [.clone](lib/view.js#L148)

Re-decorate View methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `view`: Cloned instance

**Example**

```js
view.clone({deep: true}); // false by default
```

## Related projects

* [assemble](https://www.npmjs.com/package/assemble): Static site generator for Grunt.js, Yeoman and Node.js. Used by Zurb Foundation, Zurb Ink, H5BP/Effeckt,… [more](https://www.npmjs.com/package/assemble) | [homepage](http://assemble.io)
* [en-route](https://www.npmjs.com/package/en-route): Routing for static site generators, build systems and task runners, heavily based on express.js routes… [more](https://www.npmjs.com/package/en-route) | [homepage](https://github.com/jonschlinkert/en-route)
* [engine](https://www.npmjs.com/package/engine): Template engine based on Lo-Dash template, but adds features like the ability to register helpers… [more](https://www.npmjs.com/package/engine) | [homepage](https://github.com/jonschlinkert/engine)
* [layouts](https://www.npmjs.com/package/layouts): Wraps templates with layouts. Layouts can use other layouts and be nested to any depth.… [more](https://www.npmjs.com/package/layouts) | [homepage](https://github.com/doowb/layouts)
* [template](https://www.npmjs.com/package/template): Render templates using any engine. Supports, layouts, pages, partials and custom template types. Use template… [more](https://www.npmjs.com/package/template) | [homepage](https://github.com/jonschlinkert/template)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/templates/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on September 16, 2015._
