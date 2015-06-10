# Astronomy for Meteor

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

<img src="http://astronomy.meteor.com/images/logo.png" />

The Astronomy package extends your Mongo documents with functionalities defined in the schema. It's the model layer (in [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern) for Meteor or for people coming from relational databases environment, it's the Object-relational mapping system (ORM).

## Table of Contents

- [Introduction](#introduction)
- [History](#history)
- [Why use astronomy?](#why-use-astronomy)
- [Installation](#installation)
- [Features](#features)
- [Planned features](#planned-features)
- [Changelog](#changelog)
- [Examples](#examples)
- [Key concepts](#key-concepts)
  - [Defining schema](#defining-schema)
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
    - [Inheritance](#inheritance)
  - [Modules](#modules)
- [Contribution](#contribution)
- [License](#license)

## Introduction

When fetching objects from Mongo Collections you get a simple JavaScript objects without any logic. You have to implement logic, validate attributes, check what fields have changed, save only modified fields, transform fields types when reading data from forms etc. in every place you are using them. Wouldn't it be great if you could write just like below?

```js
var post = Posts.findOne();
// Increase votes count by one.
post.voteUp();
// Auto convert a string input value to a number.
post.set('count', tmpl.find('input[name=count]').value);
// Check if all attributes are valid.
if (post.validate()) {
  // Updates document with only fields that have changed.
  post.save();
}
```

And that's exactly what Astronomy is doing. How would it look like without Astronomy?

```js
var post = Posts.findOne();
// Access fields manually without a possibility to do some extra action.
// You have to do an extra action in every place you are increasing votes count.
post.votes++;
// Manual types conversion. You have to remember to do it every time you update fields.
post.count = parseInt(tmpl.find('input[name=count]').value, 10);
// Implement some custom validation logic in every place.
if (post.count > post.votes) {
  // Implement error messages system.
  throw new Error("Votes field's value has to be at least equal " + post.count);
} else {
  // Decide what fields have change and update only them.
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

The idea of creating a package for Meteor, that would introduce the model layer, emerged after creating several simple Meteor applications. I noticed that I'm constantly repeating the same parts of code to manage storing of documents and validation. It was definitely frustrating in comparison to what I could do in the Doctrine library for PHP that I've used to use for many years.

So it's why I've decided to create a package that would follow some principles that can be found in Doctrine. The first version appeared in 2013 and was named [Verin Model](https://github.com/jagi/verin-model). I didn't promote it extensively and it didn't have many users. However it worked as expected.

In the late 2014, I've decided to give it one more try and implement much better package that would concentrate all the features, related with the model layer, that I've ever needed when creating Meteor applications. In the meanwhile many other packages appeared on the Atmosphere. However even when some of them ([SimpleSchema](https://atmospherejs.com/aldeed/simple-schema)) had features that I was looking for, on the other hand they were to complex in use. Some packages just focused on single features ([Collection Hooks](https://atmospherejs.com/matb33/collection-hooks), [Collection Behaviours](https://atmospherejs.com/sewdn/collection-behaviours)). And I didn't like the idea of using many packages that follows quite different rules, some of them modifying Meteor's core, others overriding some Meteor objects. I just wanted the one modular tool that would fit all my needs and that why I've created **Astronomy** (originally named Cosmology).

Why the name **Astronomy**? As almost everything related with Meteor is named with some cosmological term, so this one couldn't be an exception. The model layer in the MVC pattern is a description of real objects. The science describing astronomical objects is [Astronomy](http://en.wikipedia.org/wiki/Astronomy) so it couldn't be named differently.

## Why use Astronomy?

There are many other packages that do the same or have some of the Astronomy functionalities. I will try to point out here what are the main benefits of using Astronomy over other solutions.

- Beside of having many features that are listed in the [Features](#features) section...
- ... Astronomy is highly modularized. It was one the main principles when creating it. Thanks to that anyone can easily hook into almost every process that happens in the Astronomy. Developers can create their own modules, behaviors and validators.
- It's easy to learn. Astronomy does not reinvent wheel. It takes the best from the tools you are already familiar with, not only from the JavaScript world but also from the other languages.
- When using Astronomy you can easily replace from three to five packages that you already use with the one that follows the same pattern across all its modules. The main principle is simplicity.
- There are many developers that already use Astronomy and I allowed myself to post some of the comments here.


> I love your package, it's really great. As RoR developer, this package is really exciting!

> Anyway, very happy to have moved to astronomy, really like it we will release an app using it soon, so I will let you know.

> I still don't understand how this package is not getting more popular imho this package is better than simple-schema.

> Amazing work, beautifully designed package! Anyone give this package few seconds and take a look at sources? If people will write code in such clean and modular way, world would be better! Kudos Jagi!

> Amazing package indeed! Coming from a php MVC background, this package is a gift :). You rock!

> Thanks for creating an amazing package. I would request you to add two way data binding.

> Thanks - this has the makings of an amazing tool.... I'm hoping to replace Mesosphere, collection-hooks, collection-helpers, and a bunch of custom code - all with a cleaner code base!

I hope you will join and become happy user of Astronomy :)

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
- ~~EJSON-ification of documents~~
- Integration with [Orion CMS](https://github.com/orionjs/orion/)
- Modules
  - ~~Relations~~ (Partial)
  - ~~Query builder~~ (Partial)
  - Transactions
  - Migration
  - Forms
- Behaviors
  - ~~Slug~~ (creates slug from a field)
  - ~~SoftRemove~~ (instead of removing document, sets the "softRemoved" flag)
  - Version (stores multiple versions of a document)
  - Tag (adds the "tags" field with the ability to easily add and remove tags)
  - Sign (adds createdBy, updatedBy, removedBy fields storing user id)
  - Vote (adds "votes" field with ability to vote on document)
  - I18n (stores multiple language versions of a field)

## Changelog

Changelog can be found in [this file](https://github.com/jagi/meteor-astronomy/wiki/Changelog).

## Examples

A detailed examples can be found [on this Wiki page](https://github.com/jagi/meteor-astronomy/wiki/Examples).

## Key concepts

### Defining schema

To get started, we have to create a model by defining its schema. Schema is a description of model / class. The schema creation is inspired by the Doctrine library for the Symfony (PHP) framework, so anyone that had ever worked with it should feel familiar when using Astronomy.

Let's take a look at basic example of a schema creation.

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

There are two required attributes `name` and `fields`. The `name` attribute is mostly used for an inheritance purpose. However having a model without storing its objects in the database is not a big deal, so lets bind it with a Mongo collection.

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
var post = new Post(); // Create empty object
```

You can also pass an object to the class constructor to initialize it with the given values.

```js
var post = new Post({ // Initialize document with some data
  title: 'Hello World!'
});
```

#### Transformation

Objects returned from collections, which had been set in the class schema definition, will be automatically converted to the instance of the proper class.

```js
Posts = new Mongo.Collection('posts');
Post = Astro.Class({
  name: 'Post',
  collection: Posts
});

var post = Posts.findOne(); // Get instance of Post class
```

However you can turn off that behavior by setting the `transform` flag to `false` in the class schema.

```js
Posts = new Mongo.Collection('posts');
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  transform: false
});

var post = Posts.findOne(); // Get instance of Post class
```

If you want to have the automatic documents transformation turned on and you need to get a plain object you can force that for a particular query by passing `null` as a value of the `transform` option.

```js
var plainPostDoc = Posts.findOne({}, {
  transform: null // Pass null to disable transformation
});
```

#### Constructor

We can define a class constructor that will be executed every time the new object of our class is created. The constructor function receives all the arguments passed to it. During the process of document fetching from a collection, the first argument is a plain mongo document.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  init: function(attrs) { // Constructor
    alert('Creating instance!');
  }
});

var post = new Post(); // Shows alert 'Creating instance!'
```

#### Fields

The class schema is useless without definition of the fields. We have several ways of defining fields. Let's see the easiest way of defining them.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'createdAt', 'commentsCount']
});

var post = new Post();
post.set('title', 'Hello World!'); // Correct assignment
post.set(title, 123); // Correct assignment
```

In the example above we have defined three fields. Their types has not been defined so they can take any value and will be saved as set.

There are situation when we want to add some fields to the schema that is already defined. It can happen when we want to have different set of fields on the client and the server.

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

There are few predefined types of fields that you can use to define a class schema. They are:

- `'string'`
- `'number'`
- `'boolean'`
- `'object'`
- `'array'`
- `'date'`

Each type has its own casting function. A value being set will be casted to the defined type. For example, when passing a numerical value to the field of the `'date'` type, then it will be treated as a time stamp and converted to the date object. Let's see how to define fields of given types.

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
console.log(post.title); // Prints out null.
post.set('title', 'Hello World!'); // Correct assignment
post.set('title', 123); // Correct assignment but numerical value will be converted to '123' string.
```

##### Default values

Every field can has its default value if not set. Let's see how to define fields with default values.

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
console.log(post.title); // Prints out an empty string.
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

Now when setting value for a nested field it will be automatically casted to a proper type or a default value will be assigned.

```js
var item = new Item();
item.get('object.property'); // The "Some default string" value will be returned.
item.set('object.property', 123); // Value will be casted to the "123" string.
```

We can also set types and default values for array elements and objects residing in arrays. Let's see the example.

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
item.get('array.0'); // The default {} object will be returned.
item.set('array.0', 123); // The number 123 will be converted to object Number(123).
item.set('array.0', {});
item.get('array.0.property'); // The 123 number will be returned.
item.set('array.0.property', '123') // The "123" string will be converted to the 123 number.
```

##### Custom types

You can easily create you own custom field type. Let's take an example.

```js
Astro.createType({
  name: 'string',
  cast: function(value) {
    return String(value);
  }
});
```

As you can see, we use the `Astro.createType` method that gets a type definition as the only parameter. You have to provide two required attributes in this definition. The first one is the name of the type, that will be used in the field definition. The second one is the cast function, that have to return a converted value.

##### Setters and getters

Each class has the setter (`set`) and getter (`get`) functions. Let's take an example.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'commentsCount']
});

var post = new Post();
post.set('title', 'Title'); // Call field setter.
alert(post.get('title')); // Call field getter.
```

But you can also set values directly but assigned values won't be converted to the proper type of the fields.

```js
post.title = 'New title';
post.title = 123; // Value won't be converted to the string.
alert(post.title);
```

You should always set values coming from the forms using the `set` function.

The setter and getter functions are more powerful. They can take many different arguments and return a different data. Let's examine them.

In the example below, we set multiple fields at once.

```js
post.set({
  title: 'The newest title',
  commentsCount: 5
});
```

Now let's move on to the getter function. In the following example we get all the fields of the class instance.

```js
// Returns object with all fields: "_id", "title" and "commentsCount".
post.get();
```

We can also define the list of fields that we want to get using the `get` method.

```js
// Return only "title" and "commentsCount" fields' values.
post.get(['title', 'commentsCount']);
```

##### Modified fields

Each Astronomy document has the private `_original` property that stores information about an original state of the document before any modifications. Thanks to that we can determine which fields have been modified.

```js
var post = Posts.findOne();
post.getModified(); // Returns empty object {}
console.log(post.title); // Prints out 'Hello World!'

post.title = 'New title';
post.getModified(); // Returns {title: 'New title'}

// Get old values for modified fields
post.getModified(true); // Returns {title: 'Hello World!'}
```

As you can see in the example above, we can pass a boolean value as the first parameter of the `getModified` function. It determines, if we want to take values of the object before (`true`) or after (`false` or left empty) modifications.

#### Methods

Adding methods to a model is even simpler.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  methods: {
    read: function() {
      alert(this.title);
    }
  }
});

var post = new Post();
post.title = 'Hello World!'
post.read(); // Shows alert 'Hello World!'
```

We also have here several ways of adding methods to already defined schema.

```js
Post.addMethod('methodName', function() {
  // Do something
});

Post.addMethods({
  'methodNameA': function() {
    // Do something
  },
  'methodNameB': function() {
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
console.log(copy._id); // Prints out "undefined".
copy.save(); // Prints out id of the inserted document.
```

We can also automatically save the copied document by passing `true` as the first argument of the `copy` method.

```js
var post = Posts.findOne();
var copy = post.copy(true); // Auto save cloned document.
```

We can also create a copy of a document using the `EJSON.clone` function but in this case the `_id` attribute won't be cleared.

```js
var post = Posts.findOne();
var copy = EJSON.clone(post);
console.log(copy._id === post._id); // Prints out "true".
```

#### EJSON-ification

The Astronomy objects are registered as a custom EJSON type. It means that every object can be sent from the client to the server (and vice versa) using the DDP protocol. An example use of this feature was described in the [Examples](#examples) section.

The EJSON-ification of Astronomy objects requires special treatment. The default implementation has to convert an object into the JSON type and allow an object's recreation when it's needed. We do it by storing some important informations:

- the class name that was used to create an object's instance
- current fields' values
- original values before modification

These informations are minimum and every module written for Astronomy should take EJSON-ification into account and store an additional data if it's needed to recreated the object in its original state. We can do it thanks to the special events, that we can hook into. There are two main functions dealing with EJSON-inification [`toJSONValue`](http://docs.meteor.com/#/full/ejson_type_toJSONValue) and [`fromJSONValue`](http://docs.meteor.com/#/full/ejson_add_type). You can read more about them in the Meteor [documentation](http://docs.meteor.com/#/full/ejson).

Let's take an example module that add some extra data during the process of EJSON-ification.

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

As you can see each event receives the event object that contains the "data" attribute. This is the main object with which we will be working. Let's talk about the `onToJSONValue` function first. We want to convert our object into the JSON format. The `e.data` object already stores some information generated by the default `toJSONValue` method. It contains three values `class`, `original` and `values`. We can extend this object with some extra data. We have some private errors object stored in the `this._errors` attribute. We want these errors to be passed through the DDP protocole. To do that, we have to extend the `e.data` object like in the example above.

With this function, we've done half of the job. Now, we have to recover an object from the JSON format. It's the opposite operation which you can see implemented in the `onFromJSONValue` function. We take the `e.data.errors` attribute and put back in our object (`this`) on its place `this._errors = e.data.errors`.

#### Reactivity and reloading

As you may know the collection's `find` method returns a Mongo cursor which is reactive. The Astronomy library doesn't change anything here - cursors are still reactive.

```js
Template.main.helpers({
  posts: function() {
    var cursor = Posts.find(); // Get reactive cursor in the reactive context.
    return cursor;
  }
});
```

Now take a look at the code below. This code is also reactive beacuse it's called in the reactive context (helper function). In fact, it doesn't matter if you use Astronomy or not, the below code will be reactive.

```js
Template.main.helpers({
  posts: function() {
    var doc = Posts.findOne(); // Get document in the reactive context.
    return doc;
  }
});
```

However there are situations when you get an object from the collection outside of the reactive context. If anyone will modify this document in the database, we won't be notified about that change. There are situation when you want to make sure that the document's state is the same as the one stored in the collection on the server. You can always update the document to its most recent version by executing the `reload` method.

```js
var post = Posts.findOne(); // Get document outside of the reactive context.
post.reload(); // Update document to its most recent state.
```

Standard JavaScript documents/object as well as Astronomy documents/objects are not reactive. When getting such an object not from the reactive Mongo cursor (example code below) it won't update UI reactively.

```js
Template.main.helpers({
  post: function() {
    // The document had been just created and there was no reactive cursor
    // associated with the collection. The document is not reactive even though
    // it was used in the reactive context.
    var post = new Post();
    return post;
  }
});
```

#### Saving, updating and removing

Let's move on to the very important process of storing documents in the collection. We manage it by using just two functions `save` and `remove`. The `save` method knows if the given object has already been stored in the collection. It knows, if it needs updating or it's a new object to insert.

```js
var post = new Post();
post.title = 'Title';
post.save(); // Inserts document into collection

post.title = 'New title';
post.save(); // Updates document (updates only modified fields)

post.remove(); // Remove document from collection
```

We can also pass a callback function like we could normally do when using the `insert`, `update` or `remove` methods.

```js
var post = new Post();
post.title = 'Title';
post.save(function(err, id) {
  if (!err) {
    alert('Document inserted with the ID: ' + id);
  }
});
```

#### Events

##### Storage events

There are eight events that can be called during operations on collections: `beforesave`, `beforeinsert`, `beforeupdate`, `beforeremove`, `aftersave`, `afterinsert`, `afterupdate`, `afterremove`. Their names are self explanatory. We can hook into process of saving, inserting, updating and removing of a document.  NOTE: these hooks are into the save() and remove() events of the Class - they will not be called on direct manipulations of the underlying collections (i.e. Posts.remove(id)).

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
post.save(); // The "beforesave" event will be invoked.
```

##### Field events

There are also four events related with setting and getting fields' values: `beforeset`, `beforeget`, `afterset`, `afterget`. Take a look at the example of using them.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'slug'],
  events: {
    afterset: function(e) {
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
post.title = 'This is the title';

console.log(post.slug); // Will print "this-is-the-title".
```

##### Global events

We can also define global events that will be executed in the context of any created document. Let's take a look at the example.

```js
Astro.eventManager.on('afterset', function(e) {
  console.log('The "' + e.data.field + '" had been set to "' + e.data.value + '" on the object of the "' + this.constructor.getName() + '" class');
});

var post = new Post();
post.title = 'title'; // The "afterset" event triggered.

var item = new Item();
item.name = 'name'; // The "afterset" event triggered.

var car = new Car();
car.wheels = 4; // The "afterset" event triggered.
```

##### Class event

There is a class initialization event that you can hook into on the global level or on the level of module. This event is used in the custom modules or behaviors.

```js
Astro.eventManager.on('initclass', function(schemaDefinition) {
  var Class = this; // "this" points to the class being initialized.
});
```

##### Instance event

There is a instance initialization event that you can hook into on the global level or on the level of a class.

```js
Astro.eventManager.on('initinstance', function(attrs) {
  // "this" points to the instance being created.
});

// or

Post.addEvent('initinstance', function(attrs) {
  // "this" points to the instance being created.
});
```

##### Events propagation

Astronomy events work almost like the regular JavaScript events and you can also stop their propagation. Every event handler receives an instance of the `Event` object as its first arguments. The event data object has the `stopPropagation` method that stops execution of any further events of given type on the object util the next event occurrence.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title'],
  events: {
    beforesave: function(e) {
      console.log('First event executed');
      e.stopPropagation();
    }
  }
});

Post.addEvent('beforesave', function(e) {
  console.log('Second event that will not be executed because of the stopped event propagation');
});

var post = new Post();
post.save(); // Only first event handle will be executed.
```

It is also important in which order the event propagation occurs.

1. At first, an event is triggered on a document that caused the event to occur.
2. When the event's propagation hadn't been stopped, then we check if the document has a parent class. If it does then we invoke the event on the parent class (only if defined).
3. We repeat the step 2 until we reach the last parent class.
4. In the end, a global event is invoked (only if defined).

Take a look at the example.

```js
Parent = Astro.Class({
  name: 'Parent',
  collection: Items,
  fields: ['parent'],
  events: {
    beforesave: function() {
      console.log('Parent.beforesave');
    }
  }
});

Child = Astro.Class({
  name: 'Child',
  fields: ['child'],
  events: {
    beforesave: function() {
      console.log('Child.beforesave');
    }
  }
});

Astro.eventManager.on('beforesave', function() {
  console.log('Global.beforesave');
});

var child = new Child();
child.save();
// Events will be executed in the following order:
// 1. Child.beforesave
// 2. Parent.beforesave
// 3. Global.beforesave
```

#### Inheritance

Inheritance is as simple as telling what model definition to extend. Documents of the child and parent classes are stored in the same collection. The distinction what document is of which type is done by looking at the special `_type` field that is automatically defined on the inherited documents. You shouldn't make any changes to this attribute.

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

console.log(child._type); // Prints out 'Child`
```

### Modules

The modules system is a huge subject, so we moved this section to the [separate Wiki page](https://github.com/jagi/meteor-astronomy/wiki/Modules).

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create an issue or a pull request.

## License

MIT
