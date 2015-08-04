# Astronomy for Meteor

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

<img src="http://astronomy.meteor.com/images/logo.png" />

The Astronomy package extends your MongoDB documents with functionalities defined in the schema. It's the model layer (in the [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern) for Meteor. Or, for people coming from relational database environments, it's the Object-Relational Mapping system (ORM).

## Table of Contents

- [Introduction](#introduction)
- [History](#history)
- [Why use Astronomy?](#why-use-astronomy)
- [Installation](#installation)
- [Features](#features)
- [Planned features](#planned-features)
- [Changelog](#changelog)
- [Examples](#examples)
- [Key concepts](#key-concepts)
  - [Defining a schema](#defining-a-schema)
    - [Transformation](#transformation)
    - [Constructor](#constructor)
    - [Fields](#fields)
      - [Types](#types)
      - [Default values](#default-values)
      - **[Nested fields](#nested-fields) NEW in 0.10.5**
      - [Custom types](#custom-types)
      - [Setters and getters](#setters-and-getters)
      - [Modified fields](#modified-fields)
    - [Methods](#methods)
    - [Cloning](#cloning)
    - [EJSON-ification](#ejson-ification)
    - [Reactivity and reloading](#reactivity-and-reloading)
    - [Saving, updating and removing](#saving-updating-and-removing)
    - [Events](#events)
      - [Storage events](#storage-events)
      - [Field events](#field-events)
      - [Global events](#global-events)
      - [Class event](#class-event)
      - [Instance event](#instance-event)
      - [Events propagation](#events-propagation)
    - [Indexes](#indexes)
    - [Inheritance](#inheritance)
  - [Modules](#modules)
- [Contribution](#contribution)
- [License](#license)

## Introduction

When fetching objects from Mongo Collections, you get simple JavaScript objects without any logic. You have to implement logic, validate attributes, check what fields have changed, save only modified fields, transform field types when reading data from forms etc. in every place you are using them. Wouldn't it be great if you could write code just like below?

```js
var post = Posts.findOne();
// Increase votes count by one.
post.voteUp();
// Auto convert a string input value to a number.
post.set('count', tmpl.find('input[name=count]').value);
// Check if all attributes are valid.
if (post.validate()) {
  // Update document with only fields that have changed.
  post.save();
}
```

And that's exactly what Astronomy is doing. Here's what the above would look like without Astronomy:

```js
var post = Posts.findOne();
// Access fields manually without the possibility of taking extra action.
// You have to perform an extra action in every place you are increasing the vote count.
post.votes++;
// Manual type conversion. You have to remember to do this every time you update fields.
post.count = parseInt(tmpl.find('input[name=count]').value, 10);
// Implement custom validation logic every time.
if (post.count > post.votes) {
  // Implement an error message system.
  throw new Error("Votes field's value has to be at least equal " + post.count);
} else {
  // Detect what fields have change and update only those.
  Posts.update({
    _id: post._id
  }, {
    $set: {
      votes: post.votes,
      count: post.count
    }
  });
}
```

Which approach is simpler? I think the answer is obvious :).

## History

The idea of creating a package for Meteor that would introduce a model layer, emerged after creating several simple Meteor applications. I noticed that I was constantly repeating the same parts of code to manage document storage and validation. It was definitely frustrating in comparison to what I could do in the *Doctrine* library for PHP that I had used for many years.

This is why I've decided to create a package that would follow some of the principles that can be found in *Doctrine*. The first version was released in 2013 and was named [Verin Model](https://github.com/jagi/verin-model). I didn't promote it extensively and it didn't have many users. However, it worked as expected.

In late 2014, I decided to give it one more try and implement a much better package that would concentrate all the features related to the model layer, that I had ever needed when creating Meteor applications. In the meanwhile, many other packages appeared on the Atmosphere. However even though some of them (e.g. [SimpleSchema](https://atmospherejs.com/aldeed/simple-schema)) had features that I was looking for, on the other hand they were too complex to use. Some packages just focused on single features ([Collection Hooks](https://atmospherejs.com/matb33/collection-hooks), [Collection Behaviours](https://atmospherejs.com/sewdn/collection-behaviours), [Collection Helpers](https://atmospherejs.com/dburles/collection-helpers)). Plus, I didn't like the idea of using many packages that followed quite different rules, some of them modifying Meteor's core, others overriding Meteor objects. I just wanted one modular tool that would fit all my needs. That's why I've created **Astronomy**.

Why the name **Astronomy**? As almost everything Meteor-related has some space-related name, this one couldn't be an exception. The model layer in the MVC pattern is a description of real objects. The science describing objects found in space is called [Astronomy](http://en.wikipedia.org/wiki/Astronomy), so the name was pretty obvious.

## Why use Astronomy?

There are many other packages that implement some of the functionality in Astronomy. I will try to point out here the main benefits of using Astronomy over other solutions.

- Besides having many features that are listed in the [Features](#features) section...
- ... Astronomy is highly modularized. This was one of the main principles when creating it. Thanks to that, anyone can easily hook into almost every process that happens in Astronomy. Developers can create their own modules, behaviors and validators.
- It's easy to learn. Astronomy does not reinvent the wheel. It takes the best from the tools you are already familiar with, not only from the JavaScript world, but also from other languages.
- When using Astronomy, you can easily replace three to five packages that you already use with a single one that follows the same pattern across all its modules. The main principle is simplicity.
- There are many developers who already use Astronomy and I allowed myself to post some of their comments here:

> If this package were around when I created SimpleSchema, I would have used it instead of creating SimpleSchema.

-- [Eric Dobbertin, author of SimpleSchema](https://github.com/jagi/meteor-astronomy/issues/27#issuecomment-110996499)

> I love your package, it's really great. As RoR developer, this package is really exciting!

> Anyway, very happy to have moved to astronomy, really like it we will release an app using it soon, so I will let you know.

> I still don't understand how this package is not getting more popular imho this package is better than simple-schema.

> Amazing work, beautifully designed package! Anyone give this package few seconds and take a look at sources? If people will write code in such clean and modular way, world would be better! Kudos Jagi!

> Amazing package indeed! Coming from a php MVC background, this package is a gift :). You rock!

> Thanks for creating an amazing package. I would request you to add two way data binding.

> Thanks - this has the makings of an amazing tool.... I'm hoping to replace Mesosphere, collection-hooks, collection-helpers, and a bunch of custom code - all with a cleaner code base!

-- other developers

I hope you will join us and become a happy user of Astronomy :)

## Installation

```sh
$ meteor add jagi:astronomy
```

## Features

- [Documents transformation on fetch](#transformation)
- [Fields types](#types)
- [Fields default values](#types)
- [Documents EJSON-ification](#ejson-ification) (sending docs through DDP protocol)
- [Methods](#methods)
- [Events](#events)
- [Setters and getters](#setters-and-getters)
- [Getter of modified fields](#modified-fields)
- [Documents cloning](#cloning)
- [Documents reloading](#reactivity-and-reloading)
- [Indexes](#indexes)
- [Inheritance](#inheritance)
- [Modules](#modules)
  - [Validators](https://github.com/jagi/meteor-astronomy/wiki/Validators)
  - [Simple validators](https://github.com/jagi/meteor-astronomy/wiki/Simple-Validators)
  - [Behaviors](https://github.com/jagi/meteor-astronomy/wiki/Behaviors)
    - [timestamp](https://github.com/jagi/meteor-astronomy/wiki/Timestamp-Behavior)
    - [slug](https://github.com/jagi/meteor-astronomy/wiki/Slug-Behavior)
    - [sort](https://github.com/jagi/meteor-astronomy/wiki/Sort-Behavior)
    - [softremove](https://github.com/jagi/meteor-astronomy/wiki/SoftRemove-Behavior)
  - [Relations](https://github.com/jagi/meteor-astronomy/wiki/Relations)
  - [Query builder](https://github.com/jagi/meteor-astronomy/wiki/Query-Builder)

## Planned features

- ~~Custom field types~~
- Integration with [Orion CMS](https://github.com/orionjs/orion/)
- Modules
  - ~~Relations~~ (Partial)
  - ~~Query builder~~ (Partial)
  - Transactions
  - Migration
  - Forms
- Behaviors
  - Version (stores multiple versions of a document)
  - Tag (adds the "tags" field with the ability to easily add and remove tags)
  - Sign (adds createdBy, updatedBy, removedBy fields storing user id)
  - Vote (adds "votes" field with ability to vote on document)
  - I18n (stores multiple language versions of a field)

## Changelog

The change log can be found in [this file](https://github.com/jagi/meteor-astronomy/wiki/Changelog).

## Examples

A detailed example can be found [on this Wiki page](https://github.com/jagi/meteor-astronomy/wiki/Examples).

## Key concepts

### Defining a schema

To get started, we have to create a model by defining its schema. A schema is a description of the model / class. The schema creation is inspired by the Doctrine library for the Symfony (PHP) framework, so anyone who has ever worked with it should feel familiar with Astronomy.

Let's take a look at a basic example of schema creation.

```js
Post = Astronomy.createClass({
  name: 'Post'
});
```

You can also use the `Class` alias. We will be using it throughout this documentation.

```js
Post = Astronomy.Class({
  name: 'Post'
});
```

There is also the `Astro` alias for the `Astronomy` object.

```js
Post = Astro.Class({
  name: 'Post'
});
```

There are two required attributes: `name` and `fields`. The `name` attribute is mostly used for inheritance purposes. However, having a model without storing its objects in the database is not very useful, so let's bind it to a MongoDB collection.

```js
Posts = new Mongo.Collection('posts');
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title']
});
```

From now you can create objects of the defined class.

```js
var post = new Post();  // Create empty object
```

You can also pass an object to the class constructor to initialize it with the given values.

```js
var post = new Post({  // Initialize document with some data
  title: 'Hello World!'
});
```

#### Transformation

Once you bind a class to a Collection, objects returned from that collection will automatically be converted to instances of the proper class:

```js
Posts = new Mongo.Collection('posts');
Post = Astro.Class({
  name: 'Post',
  collection: Posts
});

var postInstance = Posts.findOne();  // Get instance of Post class
```

However, you can turn off this behavior by setting the `transform` flag to `false` in the class schema:

```js
Posts = new Mongo.Collection('posts');
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  transform: false
});

var postObject = Posts.findOne();  // Get a plain JavaScript object
```

If you want to have the automatic document instantiation turned on but occasionally need to get plain objects, you can force that for a particular query by passing `null` as a value of the `transform` option.

```js
var plainPostDoc = Posts.findOne({}, {
  transform: null  // Pass null to disable transformation
});
```

#### Constructor

When creating a class, we can specify a class constructor in the `init` property. The constructor function will be executed every time a new object of our class is created and will receive all the arguments passed to `new`. When fetching documents from a collection, the first argument is a plain Mongo document.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  init: function (attrs) {  // Constructor
    alert('Creating instance!');
  }
});

var post = new Post();  // Shows alert 'Creating instance!'
```

#### Fields

A useful schema should define some fields. We have several ways of defining fields. Here's the easiest:

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'createdAt', 'commentsCount']
});

var post = new Post();
post.set('title', 'Hello World!');  // Correct assignment
post.set('title', 123);  // Correct assignment
```

In the example above we have defined three fields. Their types have not been defined so they can take any value and will be saved as they are passed to `set`.

There are situations when we want to add some fields to a schema that is already defined. For example, we might want to have a different set of fields on the client and on the server.  We'll use `addField()`:

```js
if (Meteor.isServer) {
  Post.addField('serverOnlyFieldA');

  Post.addFields(['serverOnlyFieldB', 'serverOnlyFieldC', 'serverOnlyFieldD']);

  Post.addField('serverOnlyFieldE', 'string');

  Post.addField('serverOnlyFieldF', {
    type: 'number',
    default: 10
  });
}
```

##### Types

There are a few predefined types of fields that you can use to define a class schema. They are specified as lowercased strings indicating the type:

- `'string'`
- `'number'`
- `'boolean'`
- `'object'`
- `'array'`
- `'date'`

Each type has its own casting function. Setting a value for the field will cast it to the defined type. For example, when passing a numerical value to a field of the `'date'` type, it will be treated as a timestamp and converted to a `Date` object. Here are few examples:

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: {
    title: 'string',
    createdAt: 'date',
    commentsCount: 'number'
  }
});

var post = new Post();
console.log(post.title);  // Prints null.
post.set('title', 'Hello World!');  // Correct assignment
post.set('title', 123);  // Correct assignment but the numerical value will be converted to the '123' string.
```

##### Default values

Every field can have a default value if one is not specified when creating the object. Simply assign the default value to the `default` field of the class:

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: {
    title: {
      type: 'string',
      default: ''
    },
    createdAt: {
      type: 'date',
      default: null
    },
    commentsCount: {
      type: 'number',
      default: 0
    }
  }
});

var post = new Post();
console.log(post.title);  // Prints an empty string.
```

##### Nested fields

We can define types and default values not only for the fields that reside directly in the document but also for the nested fields.

```js
var Item = Astro.Class({
  name: 'Item',
  collection: Items,
  fields: {
    'object': {
      type: 'object',
      default: {}
    },
    'object.property': {
      type: 'string',
      default: 'Some default string'
    }
  }
});
```

As before, when setting a value for a nested field, it will be automatically converted to the proper type, or a default value will be assigned.

```js
var item = new Item();
item.get('object.property');  // The "Some default string" value will be returned.
item.set('object.property', 123);  // Value will be cast to the "123" string.
```

We can also set types and default values for array elements and objects residing in arrays. The syntax is the same as for Mongo: `array.$.field`.

```js
var Item = Astro.Class({
  name: 'Item',
  collection: Items,
  fields: {
    'array': {
      type: 'array',
      default: []
    },
    'array.$': {
      type: 'object',
      default: {}
    },
    'array.$.property': {
      type: 'number',
      default: 123
    }
  }
});

var item = new Item();
item.get('array.0');  // The default {} object will be returned.
item.set('array.0', 123);  // The number 123 will be converted to the object Number(123).
item.set('array.0', {});
item.get('array.0.property');  // The number 123 will be returned.
item.set('array.0.property', '123')  // The string '123' will be converted to the number 123.
```

##### Custom types

You can easily create your own custom field type using the `createType` method and specifying a `cast` function:

```js
Astro.createType({
  name: 'string',
  cast: function (value) {
    return String(value);
  }
});
```

As you can see, we use the `Astro.createType` method that gets a type definition as the only parameter. You have to provide two required attributes in this definition. The first one is the `name` of the type that will be used in the field definition. The second one is the `cast` function, that has to return a converted value.

##### Setters and getters

Each class has setter (`set`) and getter (`get`) functions:

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'commentsCount']
});

var post = new Post();
post.set('title', 'Title');  // Call field setter.
post.get('title');  // Call field getter.
```

You can also set values directly but assigned values won't be converted to the proper type of the fields.

```js
post.title = 'New title';
post.title = 123;  // Value won't be converted to String.
alert(post.title);  // 123, not '123'
```

You should always set values coming from forms using the `set` function.

There is a possibility to change the way Astronomy behaves on value assignment and force implicit setters. Let's see the example.

```js
Astro.config.supportLegacyBrowsers = false;
post.title = 123;
alert(post.title); // '123'
```

It this example, the value had been converted to string thanks to setting the `Astro.config.supportLegacyBrowsers` option to `false`. However, it has one downside. It's not supported in IE 8.0 anb below, so set this option only if you don't care about legacy browsers.

**IMPORTANT! You have to put the configuration code in the file which is executed before the creation of any Astronomy schema. In most cases it will be root or lib directory. To read more about the load order go to the File Load Order section in the official [Meteor documentation](http://docs.meteor.com/#/full/structuringyourapp)**

The setter and getter functions are even more powerful. They can take many different arguments. Let's examine the possibilites. In the example below, we set multiple fields at once.

```js
post.set({
  title: 'The newest title',
  commentsCount: 5
});
```

In the following example we get all the fields of the class instance.

```js
// Returns object with all fields: '_id', 'title' and 'commentsCount'.
post.get();
```

We can also specify the list of fields that we want to get using the `get` method.

```js
// Return only "title" and "commentsCount" fields' values.
post.get(['title', 'commentsCount']);
```

##### Modified fields

Each Astronomy document has the private `_original` property that stores information about the original state of the document before any modifications. Thanks to that we can determine which fields have been modified.

```js
var post = Posts.findOne();
post.getModified();  // Returns empty object {}
console.log(post.title);  // Prints out 'Hello World!'

post.title = 'New title';
post.getModified();  // Returns {title: "New title"}

// Get old values for modified fields
post.getModified(true);  // Returns {title: "Hello World!"}
```

As you can see in the example above, we can pass a boolean value as the first parameter of the `getModified` function:

* `true` - return the modified fields and their values before modification
* `false` (default) - return the modified fields and their values after modification

#### Methods

Adding methods to a model is even simpler.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  methods: {
    read: function () {
      alert(this.title);
    }
  }
});

var post = new Post();
post.title = 'Hello World!'
post.read();  // Shows alert 'Hello World!'
```

We also have here two ways of adding methods to an already defined schema: `addMethod` and `addMethods`:

```js
Post.addMethod('methodName', function () {
  // Do something
});

Post.addMethods({
  'methodNameA': function () {
    // Do something
  },
  'methodNameB': function () {
    // Do something
  }
});
```

#### Cloning

To clone a document you have to execute the `copy` function on the object.

```js
var post = Posts.findOne();
var copy = post.copy();
```

If an original document had already been saved into collection then its copy will have the `_id` attribute cleared. Thanks to that we will be able to save the copy as a new record in the collection.

```js
var post = Posts.findOne();
var copy = post.copy();
console.log(copy._id);  // Prints "undefined".
copy.save();  // Prints the id of the inserted document.
```

We can also automatically save the copied document by passing `true` as the first argument of the `copy` method.

```js
var post = Posts.findOne();
var copy = post.copy(true);  // Auto save cloned document.
```

We can also create a copy of a document using the `EJSON.clone` function but in this case the `_id` attribute won't be cleared.

```js
var post = Posts.findOne();
var copy = EJSON.clone(post);
console.log(copy._id === post._id);  // Prints `true`.
```

#### EJSON-ification

The Astronomy objects are registered as a custom EJSON type. This means that every object can be sent from the client to the server (and vice versa) using the DDP protocol. An example use of this feature was described in the [Examples](#examples) section.

The EJSON-ification of Astronomy objects requires special treatment. The default implementation has to convert an object into the JSON type and allow an object's recreation when it's needed. We do this by storing the following:

- the class name that was used to create an object's instance
- current field values
- original values before modification

These three pieces of information are the minimum required and every module written for Astronomy should take EJSON-ification into account and store this additional data if it needs eto recreat objects in their original state. This can be done thanks to special events that we can hook into. There are two main functions dealing with EJSON-inification: [`toJSONValue`](http://docs.meteor.com/#/full/ejson_type_toJSONValue) and [`fromJSONValue`](http://docs.meteor.com/#/full/ejson_add_type). You can read more about them in the Meteor [documentation](http://docs.meteor.com/#/full/ejson).

Let's look at an example module that adds some extra data during the process of EJSON-ification.

```js
var onToJSONValue = function(e) {
  e.data.errors = this._errors;
};

var onFromJSONValue = function(e) {
  this._errors = e.data.errors;
};

Astro.eventManager.on('tojsonvalue', onToJSONValue);
Astro.eventManager.on('fromjsonvalue', onFromJSONValue);
```

As you can see, each event receives the event object that contains the "data" attribute. This is the main object with which we will be working. Let's talk about the `onToJSONValue` function first. We want to convert our object into the JSON format. The `e.data` object already stores some information generated by the default `toJSONValue` method. It contains three properties: `class`, `original` and `values`. We can extend this object with some extra data. We have some private errors object stored in the `this._errors` attribute. We want these errors to be passed through the DDP protocol. To do that, we have to extend the `e.data` object like in the example above.

With this function, we've done half of the job. Now, we have to recover an object from the JSON format. It's the opposite operation which you can see implemented in the `onFromJSONValue` function. We take the `e.data.errors` attribute and put it back in our object (`this`) as `this._errors = e.data.errors`.

#### Reactivity and reloading

As you may know, Meteor's `Collection.find()` method returns a Mongo cursor which is reactive. Astronomy doesn't change anything here - cursors are still reactive.

```js
Template.main.helpers({
  posts: function() {
    var cursor = Posts.find();  // Get reactive cursor in the reactive context.
    return cursor;
  }
});
```

Now take a look at the code below. This code is also reactive beacuse it's called in the reactive context (helper function). In fact, it doesn't matter if you use Astronomy or not, the below code will be reactive.

```js
Template.main.helpers({
  posts: function() {
    var doc = Posts.findOne();  // Get document in the reactive context.
    return doc;
  }
});
```

However there are situations when you get an object from the collection outside of the reactive context. If this document is modified in the database, we won't be notified about that change. There are situations when you want to make sure that the document's state is the same as the one stored in the collection on the server. You can always update the document to its most recent version by executing the `reload` method.

```js
var post = Posts.findOne();  // Get document outside of the reactive context.
post.reload();  // Update document to its most recent state.
```

Standard JavaScript documents/objects as well as Astronomy documents/objects are not reactive. When getting or creating such an object from a non-reactive source (e.g. not from the reactive Mongo cursor, in the example code below), the UI won't update reactively. Again, Astronomy doesn't change anything here.

```js
Template.main.helpers({
  post: function() {
    // The document has been just created and there was no reactive cursor
    // associated with the collection. The document is not reactive even though
    // it is used in a reactive context.
    var post = new Post();
    return post;
  }
});
```

#### Saving, updating and removing

Let's move on to the very important process of storing documents in the collection. We manage that with just two methods: `save` and `remove`. The `save` method knows if the given object has already been stored in the collection and needs updating, or if it's a new object to insert.

```js
var post = new Post();
post.title = 'Title';
post.save();  // Inserts document into collection

post.title = 'New title';
post.save();  // Updates document (updates only modified fields)

post.remove();  // Remove document from collection
```

We can also pass a callback function as we normally can when using the `insert`, `update` or `remove` methods.

```js
var post = new Post();
post.title = 'Title';
post.save(function (err, id) {
  if (!err) {
    alert('Document inserted with the ID: ' + id);
  }
});
```

#### Events

##### Storage events

There are eight events that can be called during operations on collections: `beforesave`, `beforeinsert`, `beforeupdate`, `beforeremove`, `aftersave`, `afterinsert`, `afterupdate`, `afterremove`. Their names are self-explanatory. We can hook into the process of saving, inserting, updating and removing of a document.  NOTE: these hooks are into the `save()` and `remove()` events of the Class - they will not be called on direct manipulations of the underlying collections (i.e. `Posts.remove(id)`).

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  events: {
    beforesave: function () {
      this.title += '!';
    }
  }
});

var post = new Post();
post.save();  // The "beforesave" event will be invoked.
```

##### Field events

There are also four events related to setting and getting field values: `beforeset`, `beforeget`, `afterset`, `afterget`. Each event function receives an event object with the following fields:

* `data` - An object with two fields, `field` and `value`
* `type` - The type of the event, e.g. `afterset`
* `target` - the Class of the object being set or get

Calling `set` or `get` with multiple fields will generate one event for each field.

Example:

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'slug'],
  events: {
    afterset: function (e) {
      var fieldName = e.data.field;
      var value = e.data.value;

      if (fieldName === 'title') {
        this.slug = value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
      }
    }
  }
});

var post = new Post();
post.set({title: 'This is the title'});  // Triggers the "afterset" event

console.log(post.slug); // Will print "this-is-the-title".
```

##### Global events

We can also define global events that will be executed in the context of any created document. Let's take a look at an example:

```js
Astro.eventManager.on('afterset', function (e) {
  console.log('The "' + e.data.field + '" was set to "' + e.data.value + '" on the object of the "' + this.constructor.getName() + '" class');
});

var post = new Post();
post.set('title', 'title');  // The "afterset" event triggered.

var item = new Item();
item.set('name', 'name');  // The "afterset" event triggered.

var car = new Car();
car.set('wheels', 4);  // The "afterset" event triggered.
```

##### Class event

There is a class initialization event that you can hook into at the global level or at the module level. This event is used in custom modules or behaviors.

```js
Astro.eventManager.on('initclass', function (schemaDefinition) {
  var Class = this;  // `this` points to the class being initialized.
});
```

##### Instance event

There is an instance initialization event that you can hook into globally or per class.

```js
Astro.eventManager.on('initinstance', function (attrs) {
  // `this` points to the instance being created.
});

// or

Post.addEvent('initinstance', function (attrs) {
  // `this` points to the instance being created.
});
```

##### Events propagation

Astronomy events work almost like the regular JavaScript events and you can also stop their propagation. Every event handler receives an instance of the `Event` object as its first argument. The event data object has the `stopPropagation` method that stops execution of any further events of the given type on the object util the next event occurrence.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  events: {
    beforesave: function (e) {
      console.log('First event executed');
      e.stopPropagation();
    }
  }
});

Post.addEvent('beforesave', function (e) {
  console.log('Second event that will not be executed because of the stopped event propagation');
});

var post = new Post();
post.save();  // Only the first event handler will be executed.
```

It is also important in which order the event propagation occurs.

1. At first, an event is triggered on a document that caused the event to occur.
2. When the event's propagation hadn't been stopped, then we check if the document has a parent class. If it does then we invoke the event on the parent class (only if defined).
3. Repeat step 2 until we reach the last parent class.
4. In the end, a global event is invoked (only if defined).

Take a look at the example.

```js
Parent = Astro.Class({
  name: 'Parent',
  collection: Items,
  fields: ['parent'],
  events: {
    beforesave: function () {
      console.log('Parent.beforesave');
    }
  }
});

Child = Astro.Class({
  name: 'Child',
  fields: ['child'],
  events: {
    beforesave: function () {
      console.log('Child.beforesave');
    }
  }
});

Astro.eventManager.on('beforesave', function () {
  console.log('Global.beforesave');
});

var child = new Child();
child.save();
// Events will be executed in the following order:
// 1. Child.beforesave
// 2. Parent.beforesave
// 3. Global.beforesave
```

#### Indexes

To speed up the process of finding a document in a collection we should add indexes to some fields. If we sort documents by a name, it's a good idea to add an index to the `name` field. We have two ways of defining indexes in Astronomy. The first one is defining field as indexed just in its definition.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: {
    name: {
      type: 'string',
      index: 1 // Define an index (ascending order) for the "name" field.
    }
  }
});
```

The value `1` under the `index` property is an order in which index will be stored. In this case, it doesn't matter if we use ascending (`1`) or descending (`-1`) order because MongoDB can easily iterate through the one key indexes in both directions. However it does matter in the case of the multi-key indexes. Let's see how to define an index for multiple fields.

```js
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    firstName: 'string',
    lastName: 'string'
  },
  indexes: {
    fullName: {
      fields: {
        lastName: 1,
        firstName: 1
      },
      options: {}
    }
  }
});
```

As you can see, we've provided an object with the definition of indexes under the `indexes` property. The `fullName` property name is an index name. An index definition consists of two values: list of fields and list of options. In fact, it's exactly the same list of fields (keys) and options as described in the [MongoDB documentation](http://docs.mongodb.org/manual/reference/method/db.collection.createIndex/#db.collection.createIndex). If you want to read more about indexes, I encourage you to read it.

You can also add indexes to already defined class.

```js
// Add one index.
Post.addIndex('indexName', {
  fields: {},
  options: {}
});

// Add many indexes at once.
Post.addIndexes({
  firstIndexName: {
    fields: {},
    options: {}
  },
  secondIndexName: {
    fields: {},
    options: {}
  }
});
```

#### Inheritance

Inheritance is as simple as telling what model definition to extend. Documents of the child and parent classes are stored in the same collection. The type of each document is preserved in the special `_type` field that is automatically defined on the inherited documents. You shouldn't make any changes to this attribute.

```js
Parent = Astro.Class({
  name: 'Parent',
  collection: Collection,
  fields: ['parentField']
});

Child = Parent.extend({
  name: 'Child',
  fields: ['childField']
});

var parent = new Parent();
var child = new Child();

parent.save();
child.save();

console.log(child._type);  // Prints 'Child`
```

### Modules

The modules system is a huge subject, so we moved this section to the [Modules Wiki page](https://github.com/jagi/meteor-astronomy/wiki/Modules).

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create an issue or a pull request.

## License

MIT
