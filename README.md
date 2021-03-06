# templates [![NPM version](https://img.shields.io/npm/v/templates.svg?style=flat)](https://www.npmjs.com/package/templates) [![NPM downloads](https://img.shields.io/npm/dm/templates.svg?style=flat)](https://npmjs.org/package/templates) [![Build Status](https://img.shields.io/travis/jonschlinkert/templates.svg?style=flat)](https://travis-ci.org/jonschlinkert/templates)

System for creating and managing template collections, and rendering templates with any node.js template engine. Can be used as the basis for creating a static site generator or blog framework.

## TOC

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  * [Common](#common)
    + [.option](#option)
    + [.use](#use)
  * [App](#app)
  * [Engines](#engines)
  * [Helpers](#helpers)
  * [Built-in helpers](#built-in-helpers)
  * [View](#view)
    + [View Data](#view-data)
  * [Item](#item)
    + [Item Data](#item-data)
  * [Views](#views)
    + [Views Data](#views-data)
    + [Lookup methods](#lookup-methods)
  * [Collections](#collections)
  * [List](#list)
  * [Group](#group)
  * [Lookups](#lookups)
  * [Rendering](#rendering)
  * [Context](#context)
  * [Routes and middleware](#routes-and-middleware)
  * [is](#is)
- [History](#history)
- [Related projects](#related-projects)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [License](#license)

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install templates --save
```

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

## Usage

```js
var templates = require('templates');
var app = templates();
```

## API

### Common

This section describes API features that are shared by all Templates classes.

#### .option

Set or get an option value.

**Params**

* `key` **{String|Object}**: Pass a key-value pair or an object to set.
* `val` **{any}**: Any value when a key-value pair is passed. This can also be options if a glob pattern is passed as the first value.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
app.option('a', 'b');
app.option({c: 'd'});
console.log(app.options);
//=> {a: 'b', c: 'd'}
```

#### .use

Run a plugin on the given instance. Plugins are invoked immediately upon instantiating in the order in which they were defined.

**Example**

The simplest plugin looks something like the following:

```js
app.use(function(inst) {
  // do something to `inst`
});
```

Note that `inst` is the instance of the class you're instantiating. So if you create an instance of `Collection`, inst is the collection instance.

**Params**

* `fn` **{Function}**: Plugin function. If the plugin returns a function it will be passed to the `use` method of each item created on the instance.
* `returns` **{Object}**: Returns the instance for chaining.

**Usage**

```js
collection.use(function(items) {
  // `items` is the instance, as is `this`

  // optionally return a function to be passed to
  // the `.use` method of each item created on the
  // instance
  return function(item) {
    // do stuff to each `item`
  };
});
```

### App

API for the main `Templates` class.

### [Templates](index.js#L46)

This function is the main export of the templates module. Initialize an instance of `templates` to create your application.

**Params**

* `options` **{Object}**

**Example**

```js
var templates = require('templates');
var app = templates();
```

### [.list](index.js#L185)

Create a new list. See the [list docs](docs/lists.md) for more information about lists.

**Params**

* `opts` **{Object}**: List options
* `returns` **{Object}**: Returns the `list` instance for chaining.

**Example**

```js
var list = app.list();
list.addItem('abc', {content: '...'});

// or, create list from a collection
app.create('pages');
var list = app.list(app.pages);
```

### [.collection](index.js#L224)

Create a new collection. Collections are decorated with special methods for getting and setting items from the collection. Note that, unlike the [create](#create) method, collections created with `.collection()` are not cached.

See the [collection docs](docs/collections.md) for more
information about collections.

**Params**

* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

### [.create](index.js#L276)

Create a new view collection to be stored on the `app.views` object. See
the [create docs](docs/collections.md#create) for more details.

**Params**

* `name` **{String}**: The name of the collection to create. Plural or singular form may be used, as the inflections are automatically resolved when the collection is created.
* `opts` **{Object}**: Collection options
* `returns` **{Object}**: Returns the `collection` instance for chaining.

### [.setup](index.js#L404)

Expose static `setup` method for providing access to an instance before any other use code is run.

**Params**

* `app` **{Object}**: Application instance
* `name` **{String}**: Optionally pass the constructor name to use.
* `returns` **{undefined}**

**Example**

```js
function App(options) {
  Templates.call(this, options);
  Templates.setup(this);
}
Templates.extend(App);
```

***

### [.engine](lib/plugins/engine.js#L33)

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

***

### [.helper](lib/plugins/helpers.js#L24)

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

### [.helpers](lib/plugins/helpers.js#L45)

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

### [.getHelper](lib/plugins/helpers.js#L62)

Get a previously registered helper.

**Params**

* `name` **{String}**: Helper name
* `returns` **{Function}**: Returns the registered helper function.

**Example**

```js
var fn = app.getHelper('foo');
```

### [.getAsyncHelper](lib/plugins/helpers.js#L79)

Get a previously registered async helper.

**Params**

* `name` **{String}**: Helper name
* `returns` **{Function}**: Returns the registered helper function.

**Example**

```js
var fn = app.getAsyncHelper('foo');
```

### [.hasHelper](lib/plugins/helpers.js#L98)

Return true if sync helper `name` is registered.

**Params**

* `name` **{String}**: sync helper name
* `returns` **{Boolean}**: Returns true if the sync helper is registered

**Example**

```js
if (app.hasHelper('foo')) {
  // do stuff
}
```

### [.hasAsyncHelper](lib/plugins/helpers.js#L116)

Return true if async helper `name` is registered.

**Params**

* `name` **{String}**: Async helper name
* `returns` **{Boolean}**: Returns true if the async helper is registered

**Example**

```js
if (app.hasAsyncHelper('foo')) {
  // do stuff
}
```

### [.asyncHelper](lib/plugins/helpers.js#L134)

Register an async helper.

**Params**

* `name` **{String}**: Helper name.
* `fn` **{Function}**: Helper function

**Example**

```js
app.asyncHelper('upper', function(str, next) {
  next(null, str.toUpperCase());
});
```

### [.asyncHelpers](lib/plugins/helpers.js#L155)

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

### [.helperGroup](lib/plugins/helpers.js#L179)

Register a namespaced helper group.

**Params**

* `helpers` **{Object|Array}**: Object, array of objects, or glob patterns.

**Example**

```js
// markdown-utils
app.helperGroup('mdu', {
  foo: function() {},
  bar: function() {},
});

// Usage:
// <%= mdu.foo() %>
// <%= mdu.bar() %>
```

### Built-in helpers

***

### View

API for the `View` class.

### [View](lib/view.js#L27)

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

### [.context](lib/view.js#L56)

Creates a context object from front-matter data, `view.locals` and the given `locals` object.

**Params**

* `locals` **{Object}**: Optionally pass locals to the engine.
* `returns` **{Object}**: Returns the context object.

**Example**

```js
var ctx = page.context({foo: 'bar'});
```

### [.compile](lib/view.js#L78)

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

### [.render](lib/view.js#L96)

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

### [.isType](lib/view.js#L130)

Return true if the view is the given view `type`. Since types are assigned by collections, views that are "collection-less" will not have a type, and thus will always return `false` (as expected).

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
view.isType('partial');
```

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Item

API for the `Item` class.

### [Item](lib/item.js#L28)

Create an instance of `Item`. Optionally pass a default object to use.

**Params**

* `item` **{Object}**

**Example**

```js
var item = new Item({
  path: 'foo.html',
  content: '...'
});
```

### [.clone](lib/item.js#L92)

Re-decorate Item methods after calling vinyl's `.clone()` method.

**Params**

* `options` **{Object}**
* `returns` **{Object}** `item`: Cloned instance

**Example**

```js
item.clone({deep: true}); // false by default
```

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Views

API for the `Views` class.

### [Views](lib/views.js#L27)

Create an instance of `Views` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Views();
collection.addView('foo', {content: 'bar'});
```

### [.setView](lib/views.js#L137)

Set a view on the collection. This is identical to [addView](#addView) except `setView` does not emit an event for each view.

**Params**

* `key` **{String|Object}**: View key or object
* `value` **{Object}**: If key is a string, value is the view object.
* `returns` **{Object}**: returns the `view` instance.

**Example**

```js
collection.setView('foo', {content: 'bar'});
```

### [.addView](lib/views.js#L184)

Similar to [setView](#setView), adds a view to the collection but also fires an event and iterates over the loading `queue` for loading views from the `addView` event listener. If the given view is not already an instance of `View`, it will be converted to one before being added to the `views` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `View` to allow chaining view methods.

**Example**

```js
var views = new Views(...);
views.addView('a.html', {path: 'a.html', contents: '...'});
```

### [.deleteView](lib/views.js#L207)

Delete a view from collection `views`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
views.deleteView('foo.html');
```

### [.addViews](lib/views.js#L231)

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

### [.addList](lib/views.js#L265)

Load an array of views onto the collection.

**Params**

* `list` **{Array}**
* `returns` **{Object}**: returns the `views` instance

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### [.groupBy](lib/views.js#L302)

Group all collection `views` by the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns an object of grouped views.

**Example**

```js
var collection = new Collection();
collection.addViews(...);
var groups = collection.groupBy('data.date', 'data.slug');
```

### [.getView](lib/views.js#L319)

Get view `name` from `collection.views`.

**Params**

* `key` **{String}**: Key of the view to get.
* `fn` **{Function}**: Optionally pass a function to modify the key.
* `returns` **{Object}**

**Example**

```js
collection.getView('a.html');
```

### [.extendView](lib/views.js#L354)

Load a view from the file system.

**Params**

* `view` **{Object}**
* `returns` **{Object}**

**Example**

```js
collection.loadView(view);
```

### [.isType](lib/views.js#L369)

Return true if the collection belongs to the given view `type`.

**Params**

* `type` **{String}**: (`renderable`, `partial`, `layout`)

**Example**

```js
collection.isType('partial');
```

### [.viewTypes](lib/views.js#L416)

Alias for `viewType`

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### [.find](lib/plugins/lookup.js#L25)

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

### [.getView](lib/plugins/lookup.js#L69)

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

### [.getViews](lib/plugins/lookup.js#L103)

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

***

### Collections

API for the `Collections` class.

### [Collection](lib/collection.js#L25)

Create an instance of `Collection` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var collection = new Collection();
collection.addItem('foo', {content: 'bar'});
```

### [.setItem](lib/collection.js#L96)

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### [.addItem](lib/collection.js#L119)

Similar to `setItem`, adds an item to the collection but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener.  An item may be an instance of `Item`, if not, the item is converted to an instance of `Item`.

**Params**

* `key` **{String}**
* `value` **{Object}**

**Example**

```js
var list = new List(...);
list.addItem('a.html', {path: 'a.html', contents: '...'});
```

### [.deleteItem](lib/collection.js#L143)

Delete an item from collection `items`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining

**Example**

```js
items.deleteItem('abc');
```

### [.addItems](lib/collection.js#L166)

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### [.addList](lib/collection.js#L193)

Load an array of items onto the collection.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the Collection instance for chaining

**Example**

```js
collection.addList([
  {path: 'a.html', content: '...'},
  {path: 'b.html', content: '...'},
  {path: 'c.html', content: '...'}
]);
```

### [.getItem](lib/collection.js#L224)

Get an item from the collection.

**Params**

* `key` **{String}**: Key of the item to get.
* `returns` **{Object}**

**Example**

```js
collection.getItem('a.html');
```

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### List

API for the `List` class.

### [List](lib/list.js#L31)

Create an instance of `List` with the given `options`. Lists differ from collections in that items are stored as an array, allowing items to be paginated, sorted, and grouped.

**Params**

* `options` **{Object}**

**Example**

```js
var list = new List();
list.addItem('foo', {content: 'bar'});
```

### [.setItem](lib/list.js#L123)

Set an item on the collection. This is identical to [addItem](#addItem) except `setItem` does not emit an event for each item and does not iterate over the item `queue`.

**Params**

* `key` **{String|Object}**: Item key or object
* `value` **{Object}**: If key is a string, value is the item object.
* `returns` **{Object}**: returns the `item` instance.

**Example**

```js
collection.setItem('foo', {content: 'bar'});
```

### [.addItem](lib/list.js#L160)

Similar to [setItem](#setItem), adds an item to the list but also fires an event and iterates over the item `queue` to load items from the `addItem` event listener. If the given item is not already an instance of `Item`, it will be converted to one before being added to the `items` object.

**Params**

* `key` **{String}**
* `value` **{Object}**
* `returns` **{Object}**: Returns the instance of the created `Item` to allow chaining item methods.

**Example**

```js
var items = new Items(...);
items.addItem('a.html', {path: 'a.html', contents: '...'});
```

### [.addItems](lib/list.js#L187)

Load multiple items onto the collection.

**Params**

* `items` **{Object|Array}**
* `returns` **{Object}**: returns the instance for chaining

**Example**

```js
collection.addItems({
  'a.html': {content: '...'},
  'b.html': {content: '...'},
  'c.html': {content: '...'}
});
```

### [.addList](lib/list.js#L216)

Load an array of items or the items from another instance of `List`.

**Params**

* `items` **{Array}**: or an instance of `List`
* `fn` **{Function}**: Optional sync callback function that is called on each item.
* `returns` **{Object}**: returns the List instance for chaining

**Example**

```js
var foo = new List(...);
var bar = new List(...);
bar.addList(foo);
```

### [.hasItem](lib/list.js#L253)

Return true if the list has the given item (name).

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.addItem('foo.html', {content: '...'});
list.hasItem('foo.html');
//=> true
```

### [.getIndex](lib/list.js#L269)

Get a the index of a specific item from the list by `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**

**Example**

```js
list.getIndex('foo.html');
//=> 1
```

### [.getItem](lib/list.js#L313)

Get a specific item from the list by `key`.

**Params**

* `key` **{String}**: The item name/key.
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<Item <foo.html>>'
```

### [.getView](lib/list.js#L332)

Proxy for `getItem`

**Params**

* `key` **{String}**: Pass the key of the `item` to get.
* `returns` **{Object}**

**Example**

```js
list.getItem('foo.html');
//=> '<Item "foo.html" <buffer e2 e2 e2>>'
```

### [.deleteItem](lib/list.js#L346)

Remove an item from the list.

**Params**

* `key` **{Object|String}**: Pass an `item` instance (object) or `item.key` (string).

**Example**

```js
list.deleteItem('a.html');
```

### [.extendItem](lib/list.js#L365)

Decorate each item on the list with additional methods
and properties. This provides a way of easily overriding
defaults.

**Params**

* `item` **{Object}**
* `returns` **{Object}**: Instance of item for chaining

### [.groupBy](lib/list.js#L384)

Group all list `items` using the given property, properties or compare functions. See [group-array](https://github.com/doowb/group-array) for the full range of available features and options.

* `returns` **{Object}**: Returns the grouped items.

**Example**

```js
var list = new List();
list.addItems(...);
var groups = list.groupBy('data.date', 'data.slug');
```

### [.sortBy](lib/list.js#L410)

Sort all list `items` using the given property, properties or compare functions. See [array-sort](https://github.com/jonschlinkert/array-sort) for the full range of available features and options.

* `returns` **{Object}**: Returns a new `List` instance with sorted items.

**Example**

```js
var list = new List();
list.addItems(...);
var result = list.sortBy('data.date');
//=> new sorted list
```

### [.paginate](lib/list.js#L458)

Paginate all `items` in the list with the given options, See [paginationator](https://github.com/doowb/paginationator) for the full range of available features and options.

* `returns` **{Object}**: Returns the paginated items.

**Example**

```js
var list = new List(items);
var pages = list.paginate({limit: 5});
```

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### Group

API for the `Group` class.

### [Group](lib/group.js#L25)

Create an instance of `Group` with the given `options`.

**Params**

* `options` **{Object}**

**Example**

```js
var group = new Group({
  'foo': { items: [1,2,3] }
});
```

***

### [.find](lib/plugins/lookup.js#L25)

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

### [.getView](lib/plugins/lookup.js#L69)

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

### [.getViews](lib/plugins/lookup.js#L103)

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

***

### [.compile](lib/plugins/render.js#L91)

Compile `content` with the given `locals`.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Load async helpers
* `returns` **{Object}**: View object with compiled `view.fn` property.

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

### [.compileAsync](lib/plugins/render.js#L165)

Asynchronously compile `content` with the given `locals` and callback.

**Params**

* `view` **{Object|String}**: View object.
* `locals` **{Object}**
* `isAsync` **{Boolean}**: Pass true to load helpers as async (mostly used internally)
* `callback` **{Function}**: function that exposes `err` and the `view` object with compiled `view.fn` property

**Example**

```js
var indexPage = app.page('some-index-page.hbs');
app.compileAsync(indexPage, function(err, view) {
  // view.fn => compiled function
});
```

### [.render](lib/plugins/render.js#L252)

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

***

### [.data](lib/plugins/context.js#L42)

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

### [.context](lib/plugins/context.js#L62)

Build the context for the given `view` and `locals`.

**Params**

* `view` **{Object}**: The view being rendered
* `locals` **{Object}**
* `returns` **{Object}**: The object to be passed to engines/views as context.

### [setHelperOptions](lib/plugins/context.js#L116)

Update context in a helper so that `this.helper.options` is
the options for that specific helper.

**Params**

* `context` **{Object}**
* `key` **{String}**

### [.mergePartials](lib/plugins/context.js#L238)

Merge "partials" view types. This is necessary for template
engines have no support for partials or only support one
type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `returns` **{Object}**: Merged partials

### [.mergePartialsAsync](lib/plugins/context.js#L278)

Merge "partials" view types. This is necessary for template engines
have no support for partials or only support one type of partials.

**Params**

* `options` **{Object}**: Optionally pass an array of `viewTypes` to include on `options.viewTypes`
* `callback` **{Function}**: Function that exposes `err` and `partials` parameters

***

### [.handle](lib/plugins/routes.js#L46)

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

### [.handleView](lib/plugins/routes.js#L111)

Deprecated, use `.handleOnce`

### [.route](lib/plugins/routes.js#L161)

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

### [.all](lib/plugins/routes.js#L183)

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

### [.param](lib/plugins/routes.js#L212)

Add callback triggers to route parameters, where `name` is the name of the parameter and `fn` is the callback function.

**Params**

* `name` **{String}**
* `fn` **{Function}**
* `returns` **{Object}**: Returns the instance of `Templates` for chaining.

**Example**

```js
app.param('title', function(view, next, title) {
  //=> title === 'foo.js'
  next();
});

app.onLoad('/blog/:title', function(view, next) {
  //=> view.path === '/blog/foo.js'
  next();
});
```

***

### [.isApp](lib/plugins/is.js#L33)

Static method that returns true if the given value is a `templates` instance (`App`).

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isApp(templates);
//=> false

templates.isApp(app);
//=> true
```

### [.isCollection](lib/plugins/is.js#L55)

Static method that returns true if the given value is a templates `Collection` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

app.create('pages');
templates.isCollection(app.pages);
//=> true
```

### [.isViews](lib/plugins/is.js#L77)

Static method that returns true if the given value is a templates `Views` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

app.create('pages');
templates.isViews(app.pages);
//=> true
```

### [.isList](lib/plugins/is.js#L100)

Static method that returns true if the given value is a templates `List` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var List = templates.List;
var app = templates();

var list = new List();
templates.isList(list);
//=> true
```

### [.isGroup](lib/plugins/is.js#L123)

Static method that returns true if the given value is a templates `Group` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var Group = templates.Group;
var app = templates();

var group = new Group();
templates.isGroup(group);
//=> true
```

### [.isView](lib/plugins/is.js#L148)

Static method that returns true if the given value is a templates `View` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isView('foo');
//=> false

var view = app.view('foo', {content: '...'});
templates.isView(view);
//=> true
```

### [.isItem](lib/plugins/is.js#L173)

Static method that returns true if the given value is a templates `Item` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var templates = require('templates');
var app = templates();

templates.isItem('foo');
//=> false

var view = app.view('foo', {content: '...'});
templates.isItem(view);
//=> true
```

### [.isVinyl](lib/plugins/is.js#L200)

Static method that returns true if the given value is a vinyl `File` instance.

**Params**

* `val` **{Object}**: The value to test.
* `returns` **{Boolean}**

**Example**

```js
var File = require('vinyl');
var templates = require('templates');
var app = templates();

var view = app.view('foo', {content: '...'});
templates.isVinyl(view);
//=> true

var file = new File({path: 'foo', contents: new Buffer('...')});
templates.isVinyl(file);
//=> true
```

***

## History

### v0.15.0

* removes `.removeItem` method that was deprecated in v0.10.7 from `List`
* `.handleView` is deprecated in favor of `.handleOnce` and will be removed in a future version. Start using `.handleOnce` now.
* adds a static `Templates.setup()` method for initializing any setup code that should have access to the instance before any other use code is run.
* upgrade to [base-data](https://github.com/node-base/base-data) v0.4.0, which adds `app.option.set`, `app.option.get` and `app.option.merge`

### v0.14.0

Although 99% of users won't be effected by the changes in this release, there were some **potentially breaking changes**.

* The `render` and `compile` methods were streamlined, making it clear that `.mergePartials` should not have been renamed to `mergePartialsSync`. So that change was reverted.
* Helper context: Exposes a `this.helper` object to the context in helpers, which has the helper name and options that were set specifically for that helper
* Helper context: Exposes a `this.view` object to the context in helpers, which is the current view being rendered. This was (and still is) always expose on `this.context.view`, but it makes sense to add this to the root of the context as a convenience. We will deprecate `this.context.view` in a future version.
* Helper context: `.get`, `.set` and `.merge` methods on `this.options`, `this.context` and the `this` object in helpers.

### v0.11.0

* Default `engine` can now be defined on `app` or a collection using using `app.option('engine')`, `views.option('engine')`
* Default `layout` can now defined using `app.option('layout')`, `views.option('layout')`. No changes have been made to `view.layout`, it should work as before. Resolves [issue/#818](../../issues/818)
* Improves logic for finding a layout, this should make layouts easier to define and find going forward.
* The built-in `view` helper has been refactored completely. The helper is now async and renders the view before returning its content.
* Adds `isApp`, `isViews`, `isCollection`, `isList`, `isView`, `isGroup`, and `isItem` static methods. All return true when the given value is an instance of the respective class.
* Adds `deleteItem` method to List and Collection, and `deleteView` method to Views.
* Last, the static `_.proto` property which is only exposed for unit tests was renamed to `_.plugin`.

### v0.10.7

* Force-update [base](https://github.com/node-base/base) to v0.6.4 to take advantage of `isRegistered` feature.

### v0.10.6

* Re-introduces fs logic to `getView`, now that the method has been refactored to be faster.

### v0.10.0

* `getView` method no longer automatically reads views from the file system. This was undocumented before and, but it's a breaking change nonetheless. The removed functionality can easily be done in a plugin.

### v0.9.5

* Fixes error messages when no engine is found for a view, and the view does not have a file extension.

### v0.9.4

* Fixes a lookup bug in render and compile that was returning the first view that matched the given name from _any_ collection. So if a partial and a page shared the same name, if the partial was matched first it was returned. Now the `renderable` view is rendered (e.g. page)

### v0.9.0

* _breaking change_: changes parameters on `app.context` method. It now only accepts two arguments, `view` and `locals`, since `ctx` (the parameter that was removed) was technically being merged in twice.

### v0.8.0

* Exposes `isType` method on `view`. Shouldn't be any breaking changes.

### v0.7.0

* _breaking change_: renamed `.error` method to `.formatError`
* adds `mergeContext` option
* collection name is now emitted with `view` and `item` as the second argument
* adds `isType` method for checking the `viewType` on a collection
* also now emits an event with the collection name when a view is created

### v0.5.1

* fixes bug where `default` layout was automatically applied to partials, causing an infinite loop in rare cases.

## Related projects

You might also be interested in these projects:

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://www.npmjs.com/package/assemble) | [homepage](https://github.com/assemble/assemble)
* [en-route](https://www.npmjs.com/package/en-route): Routing for static site generators, build systems and task runners, heavily based on express.js routes… [more](https://www.npmjs.com/package/en-route) | [homepage](https://github.com/jonschlinkert/en-route)
* [engine](https://www.npmjs.com/package/engine): Template engine based on Lo-Dash template, but adds features like the ability to register helpers… [more](https://www.npmjs.com/package/engine) | [homepage](https://github.com/jonschlinkert/engine)
* [layouts](https://www.npmjs.com/package/layouts): Wraps templates with layouts. Layouts can use other layouts and be nested to any depth.… [more](https://www.npmjs.com/package/layouts) | [homepage](https://github.com/doowb/layouts)
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://www.npmjs.com/package/verb) | [homepage](https://github.com/verbose/verb)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/templates/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install verb && npm run docs
```

Or, if [verb](https://github.com/verbose/verb) is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/templates/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on May 07, 2016._