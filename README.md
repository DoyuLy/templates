# templates [![NPM version](https://badge.fury.io/js/templates.svg)](http://badge.fury.io/js/templates)

> System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.

**Features**

* create custom view collections using `app.create('foo')`
* register any template engine for rendering views
* register helpers
* partial support
* plugins and middleware

**Example**

This is just a very small glimpse at the `templates` API!

```js
var templates = require('templates');
var app = templates();

// create a collection
app.create('pages');

// add views to the collection
app.page('a.html', {content: 'this is <%= foo %>'});
app.page('b.html', {content: 'this is <%= bar %>'});
app.page('c.html', {content: 'this is <%= baz %>'});

app.pages.getView('a.html')
  .render({foo: 'home'}, function (err, view) {
    //=> 'this is home'
  });
```

<!-- toc -->

* [Install](#install)
* [Usage](#usage)
* [API](#api)
  - [Helpers](#helpers)
  - [Collections](#collections)
  - [View](#view)
  - [List](#list)
  - [Group](#group)
* [Related projects](#related-projects)
* [Running tests](#running-tests)
* [Contributing](#contributing)
* [Author](#author)
* [License](#license)

_(Table of contents generated by [verb](https://github.com/verbose/verb))_

<!-- tocstop -->

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i templates --save
```

## Usage

```js
var templates = require('templates');
var app = templates();
```

## API

### [Templates](index.js#L32)

This function is the main export of the templates module. Initialize an instance of `templates` to create your application.

**Params**

* `options` **{Object}**

**Example**

```js
var templates = require('templates');
var app = templates();
```

### [.use](index.js#L148)

Run a plugin on the instance. Plugins are invoked immediately upon creating the collection in the order in which they were defined.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each collection created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
var app = assemble()
  .use(require('foo'))
  .use(require('bar'))
  .use(require('baz'))
```

### [.data](index.js#L174)

Set, get and load data to be passed to templates as context at render-time.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns an instance of `Templates` for chaining.

**Example**

```js
app.data('a', 'b');
app.data({c: 'd'});
console.log(app.cache.data);
//=> {a: 'b', c: 'd'}
```

### [.collection](index.js#L216)

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

### [.create](index.js#L262)

Create a new view collection that is stored on the `app.views` object. For example, if you create a collection named `posts`:

* all `posts` will be stored on `app.views.posts`
* a `post` method will be added to `app`, allowing you to add a single view to the `posts` collection using `app.post()` (equivalent to `collection.addView()`)
* a `posts` method will be added to `app`, allowing you to add views to the `posts` collection using `app.posts()` (equivalent to `collection.addViews()`)

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

### [.find](index.js#L402)

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

### [.getView](index.js#L440)

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

### [.getViews](index.js#L479)

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

### [.matchView](index.js#L511)

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

### [.matchViews](index.js#L539)

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

### [.handle](index.js#L581)

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

### [.route](index.js#L670)

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

### [.all](index.js#L692)

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

### [.param](index.js#L721)

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

### [.engine](index.js#L748)

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

### [.compile](index.js#L884)

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

### [.render](index.js#L950)

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

### [.mergePartials](index.js#L1030)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of viewTypes to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.view](index.js#L1215)

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

### Helpers

### [.helper](lib/helpers.js#L27)

Register a template helper.

**Params**

* `name` **{String}**: Helper name
* `fn` **{Function}**: Helper function.

**Example**

```js
app.helper('upper', function(str) {
  return str.toUpperCase();
});
```

### [.helpers](lib/helpers.js#L47)

Register multiple template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.helpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

### [.asyncHelper](lib/helpers.js#L72)

Get or set an async helper. If only the name is passed, the helper is returned.

**Params**

* `name` **{String}**: Helper name.
* `fn` **{Function}**: Helper function

**Example**

```js
app.asyncHelper('upper', function(str, next) {
  next(null, str.toUpperCase());
});
```

### [.asyncHelper](lib/helpers.js#L92)

Register multiple async template helpers.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
app.asyncHelpers({
  foo: function() {},
  bar: function() {},
  baz: function() {}
});
```

***

### Collections

### [Views](lib/views.js#L17)

Create an instance of `Views` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Views();
collection.addView('foo', {content: 'bar'});
```

### [.use](lib/views.js#L74)

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

### [.setView](lib/views.js#L116)

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` instance.

**Example**

```js
collection.setView('foo', {content: 'bar'});
```

### [.addView](lib/views.js#L130)

Adds event emitting and custom loading to [setView](#setView).

**Params**

* `key` **{String}**
* `value` **{Object}**

### [.addViews](lib/views.js#L156)

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

### [.addList](lib/views.js#L186)

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

### [.getView](lib/views.js#L213)

Get a view from the collection.

**Params**

* `key` **{String}**: Key of the view to get.
* `returns` **{Object}**

**Example**

```js
collection.getView('a.html');
```

***

### View

### [View](lib/view.js#L23)

Create an instance of `View`. Optionally pass a default object to use.

**Params**

* `view` **{Object}**

**Example**

```js
var view = new View({
  path: 'foo.html',
  content: '...'
});
```

### [.use](lib/view.js#L79)

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

### [.compile](lib/view.js#L100)

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

### [.render](lib/view.js#L118)

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

### [.clone](lib/view.js#L152)

Re-decorate View methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `view`: Cloned instance

**Example**

```js
view.clone({deep: true}); // false by default
```

***

### List

### [.use](lib/list.js#L67)

Run a plugin on the list instance. Plugins are invoked immediately upon creating the list in the order in which they were defined.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each view created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
list.use(function(views) {
  // `views` is the instance, as is `this`

  // optionally return a function to be passed to
  // the `.use` method of each view created on the
  // instance
  return function(view) {
    // do stuff to each `view`
  };
});
```

### [.item](lib/list.js#L92)

Returns a new item, using the `Item` class currently defined on the instance.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` object

**Example**

```js
var item = app.item('foo', {conetent: '...'});
// or
var item = app.item({path: 'foo', conetent: '...'});
```

### [.addItem](lib/list.js#L107)

Add an item to the list. An item may be an instance of `Item`, and if not the item is converted to an instance of `Item`.

**Params**

* `items` **{Object}**: Object of views

**Example**

```js
var list = new List(...);
list.addItem('a.html', {path: 'a.html', contents: '...'});
```

### [.addItems](lib/list.js#L128)

Add an object of `views` to the list.

**Params**

* `items` **{Object}**: Object of views

**Example**

```js
var list = new List(...);
list.addItems({
  'a.html': {path: 'a.html', contents: '...'}
});
```

### [.addList](lib/list.js#L146)

Add the items from another instance of `List`.

**Params**

* `list` **{Array}**: Instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.

**Example**

```js
var foo = new List(...);
var bar = new List(...);
bar.addList(foo);
```

### [.getIndex](lib/list.js#L171)

Get a the index of a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getIndex('foo.html');
//=> 1
```

### [.getItem](lib/list.js#L187)

Get a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<View <foo.html>>'
```

### [.groupBy](lib/list.js#L205)

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### [.sortBy](lib/list.js#L231)

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### [.paginate](lib/list.js#L265)

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```

***

### Group

### [Group](lib/group.js#L20)

Create an instance of `Group` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var group = new Group({
  'foo': {
    items: [1,2,3]
   }
});
```

### [.use](lib/group.js#L48)

Run a plugin on the group instance. Plugins are invoked immediately upon creating the group in the order in which they were defined.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each view created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
group.use(function(group) {
  // `group` is the instance, as is `this`
});
```

***

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

If this project doesn't do what you need, [please let us know][issue].

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on September 18, 2015._
