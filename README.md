# Astronomy for Meteor

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

<img src="http://astronomy.meteor.com/images/logo.png" />

The Astronomy package extends your Mongo documents with functionalities defined in the schema. It's the model layer (in [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern) for Meteor or for people coming from relational databases environment, it's the Object-relational mapping system (ORM).

## Table of Contents

- [Introduction](#introduction)
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
post.count = tmpl.find('input[name=count]').value;
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

Why the name **Astronomy**? As almost everything related with Meteor is named with some cosmological term, so this one couldn't be an exception. The model layer in the MVC pattern is a description of real objects. While the science describing astronomical objects is [Astronomy](http://en.wikipedia.org/wiki/Astronomy).

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

Changelog can be found in the HISTORY.md file.

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

The class schema is useless without definition of the fields. We have several ways of defining fields. Let's examine each one.

**Simple list of fields:**

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'createdAt', 'commentsCount']
});

var post = new Post();
post.title = 'Hello World!'; // Correct assignment
post.title = 123; // Correct assignment
```

In the example above we have defined three fields. Their types has not been defined so they can take any value and will be saved as set.

**Lists of fields with types:**

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
post.title = 'Hello World!'; // Correct assignment
post.title = 123; // Correct assignment but numerical value will be converted to '123' string.
```

**List of fields with types and default values:**

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

**Adding fields to already defined schema:**

There are situation when we want to add some fields for the schema that is already defined. It can happen when we want to have different set of fields in the client and the server.

```js
if (Meteor.isServer) {
  Post.addField('serverOnlyFieldA', {
    type: 'number',
    default: 10
  });

  Post.addField('serverOnlyFieldB', 'string');

  Post.addField('serverOnlyFieldC');

  Post.addFields(['serverOnlyFieldD', 'serverOnlyFieldE', 'serverOnlyFieldF']);
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

Each type has its own casting function that will try to parse any value to a given type. For example when you pass a numerical value into the field of the `'date'` type it will be treated as a timestamp.

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

Each fields defined in the schema has its own setter and getter functions. Let's take an example.

```js
Post = Astro.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'commentsCount']
});

var post = new Post();
post.title = 'Title'; // Call field setter.
alert(post.title); // Call field getter.
```

But you can also call the setter and getter functions directly.

```js
post.set('title', 'New title');
alert(post.get('title'));
```

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

There are two internal objects in each Astronomy document. They are `_values` and `_original`. In the beginning (after fetching or creating a new document) both internal objects are the same (the `_original` object contains copies, not references, of all the values in the `_values` object). Modification of any field causes setting a new value for that field in the `_values` internal object. Thanks to that, we can compare values in the `_original` and `_values` objects and decide what fields had been modified.

```js
var post = Posts.findOne();
post.getModified(); // Returns empty object {}
console.log(post.title); // Prints out 'Hello World!'

post.title = 'New title';
post.getModified(); // Returns {title: 'New title'}

// Get old values for modified fields
post.getModified(true); // Returns {title: 'Hello World!'}
```

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
- internal `_original` and `_values` objects

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

There are eight events that can be called during operations on collections: `beforesave`, `beforeinsert`, `beforeupdate`, `beforeremove`, `aftersave`, `afterinsert`, `afterupdate`, `afterremove`. Their names are self explanatory. We can hook into process of saving, inserting, updating and removing of a document.

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
