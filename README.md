# Meteor Astronomy

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jagi/meteor-astronomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

**Table of Contents**

- [About](#about)
- [Installation](#installation)
- [Features](#features)
- [Planned features](#planned-features)
- [Change log](#change-log)
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
      - [Events propagation](#events-propagation)
    - [Inheritance](#inheritance)
  - [Modules](#modules)
    - [Validators](#validators)
    - [Behaviors](#behaviors)
    - [Writing modules](#writing-modules)
- [Contribution](#contribution)
- [License](#license)

## About

Meteor Astronomy is model layer (in [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern) for Meteor.

When fetching objects from Mongo Collections you get simple JavaScript objects without any logic. You have to implement logic, validate attributes, check what fields have changed, save only modified fields, transform fields types when reading data from forms etc. in every place you are using them. Wouldn't it be great if you could write just like below?
```js
var post = Posts.findOne();
// Increase votes count by one.
post.voteUp();
// Auto convert string input value to number.
post.count = tmpl.find('input[name=count]').value;
// Check if all attributes are valid.
if (post.validate()) {
  // Updates document with only fields that have changed.
  post.save();
}
```
And that's exactly what Meteor Astronomy is doing.

How would it look like without Meteor Astronomy?
```js
var post = Posts.findOne();
// Access fields manually without possibility to do some extra action.
// You have to do extra action in every place you are increasing votes count.
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
What approach is simpler? I think the answer is obvious :).

Why the name Meteor Astronomy? As almost everything related to the Meteor is named with some cosmological term, so this one couldn't be an exception. The model layer in MVC pattern is the description of real objects and the science describing astronomical objects is [Astronomy](http://en.wikipedia.org/wiki/Astronomy).

## Installation

```sh
$ meteor add jagi:astronomy
```

## Features

- Automatic documents transformation
- Fields definition (type, default value)
- Methods definition
- Events (before/after: save, update, insert and remove)
- Setters and getters
- Modified fields getter
- Documents cloning
- Documents reloading
- Inheritance
- Possibility to extend functionality using behaviors ([`jagi:astronomy-behaviors` package](https://github.com/jagi/meteor-astronomy-behaviors))
- Validators ([`jagi:astronomy-validators` package](https://github.com/jagi/meteor-astronomy-validators))

## Planned features

- ~~Custom field types~~
- ~~EJSONinification of documents~~
- Relations definition
- Integration with [Orion CMS](https://github.com/orionjs/orion/)
- Schema migration
- Automatic related object fetching
- Form -> Object, Object -> Form conversion
- Transactions
- Behaviors
  - Vote
  - I18n

## Change log

Change log can be found in the HISTORY.md file.

## Examples

At the beginning let's take a look at simple example showing how to use Meteor Astronomy and later we will describe in details how it works.

**Example 1: Basic operations**

```js
// Create global (no var keyword) Mongo collection.
Posts = new Mongo.Collection('posts');

// Create global (no var keyword) class (model).
Post = Astronomy.Class({
  name: 'Post', // Name model.
  collection: Posts, // Associate collection with the model.
  transform: true, // Auto transform objects fetched from collection.
  fields: {
    title: 'string', // Define "title" field of String type.
    votes: {
      type: 'number', // Define "votes" field of Number type.
      default: 0 // Set default "votes" field value to 0.
    }
  },
  methods: { // Define few methods.
    voteUp: function () {
      this.votes++;
    },
    voteDown: function () {
      this.votes--;
    }
  },
  behaviors: ['Timestamp'] // Add "timestamp" behavior that adds "createdAt" and "updatedAt" fields.
});

// Create object of our class.
var post = new Post({
  title: 'New post'
});
// Save object in the collection
post.save();

// Change title
post.title = 'Post title changed';
// Get modified fields.
post.getModified(); // Returns {title: "Post title changed"}
// Update object (save changes into collection).
post.save();

// Remove object from the collection.
post.remove();
```

**Example 2: Using model with templates**

```js
if (Meteor.isClient) {
  Template.Posts.helpers({ // Provide "posts" cursor for all posts in the collection.
    posts: function() {
      return Posts.find();
    }
  });

  // Voting up and down for post is as easy as calling "voteUp" or "voteDown" method on the object.
  // The "this" keyword in the event listener is an object of our "Post" class.
  Template.Posts.events({
    'click .up': function() {
      this.voteUp();
      this.save();
    },
    'click .down': function() {
      this.voteDown();
      this.save();
    }
  });
}
```

```hbs
<head>
  <title>Posts</title>
</head>

<body>
  {{> Posts}}
</body>

<template name="Posts">
  {{#each posts}}
    <p>{{title}} <a class="up">Vote Up</a> | <a class="down">Vote Down</a> | <b>({{votes}})</b></p>
  {{/each}}
</template>
```

**Example 3: More on working with templates**

You can access document's fields the same way you would do it without Meteor Astronomy.

```hbs
<div>
  <p><a href="/post/{{post._id}}">{{post.title}}</a></p>
  <div>{{post.votes}}</div>
</div>
```

You can also call document's methods like you would do normally.

```js
Post.schema.addMethods({
  getMessage: function() {
    return 'Post title: ' + this.title;
  }
});
```

```hbs
<div>{{post.getMessage}}</div>
```

**Example 4: Using Astronomy with Iron Router**

When working with Iron Router, we may want to create link redirecting us to given route using document's id. Let's take a look at routes defined below. We have route for all posts list and route for displaying individual post. The path consists of `/post/` prefix and document id.

```js
Router.route('/', {
  name: 'posts',
  template: 'Posts'
});

Router.route('/post/:_id', {
  name: 'post'
});
```

Now, we define helper on our template that returns cursor for all posts.

```js
if (Meteor.isClient) {
  Template.Posts.helpers({ // Provide "posts" cursor for all posts in the collection.
    posts: function() {
      return Posts.find();
    }
  });
}
```

The first thing you may try to do when creating link to the post is writing code similar to the one posted below.

```hbs
<div>
  {{#each posts}}
    <p><a href="{{pathFor 'post'}}">{{title}}</a></p>
  {{/each}}
</div>
```

This code will not work. Iron Router looks for `_id` field directly on the level of the document. However, the `_id` field is not there. The `_id` is stored in the internal object `_values` and we have getter defined for the document that takes care of getting the `_id` field. Fortunately, we have the `get` function that gets pure values (simple JavaScript object). The correct code will look like follows.

**Example 5: Passing Astronomy objects to Meteor methods**

The Astronomy objects can be passed to Meteor methods without any modifications. All Astronomy classes are EJSON-able. It means that they can be transfered from client to server (and vice versa) using the DDP protocol.

```js
Meteor.methods({
  '/user/method': function(post) {
    if (post.validate()) {
      post.save();
    }
  }
});

var post = Posts.findOne();
Meteor.call('/user/method', post);
```

## Key concepts

### Defining schema

To get started, we have to create a model by defining its schema. Schema is a description of model / class. The schema creation is inspired by Doctrine library for Symfony (PHP) framework, so anyone that had ever worked with it should feel familiar when using Meteor Astronomy.

Let's take a look at basic example of schema creation.

```js
Post = Astronomy.Class({
  name: 'Post'
});
```

There is also `Astro` alias for `Astronomy` object.

```js
Post = Astro.Class({
  name: 'Post'
});
```

The only required field is `name` that is mostly used for inheritance purpose. However having model without storing its objects in the database is not big deal, so lets bind it with the Mongo collection.

```js
Posts = new Mongo.Collection('posts');
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts
});
```

From now you can create objects of defined class.

```js
var post = new Post(); // Create empty object
```

You can also pass an object to the class constructor to initialize it with the given values. However, we haven't defined any fields in our schema, so it will have no effect.

```js
var post = new Post({ // Initialize document with some data
  title: 'Hello World!'
});
```

#### Transformation

Objects returned from collections, which had been set in the class schema definition, will be automatically converted to the instance of the proper class.

```js
Posts = new Mongo.Collection('posts');
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts
});

var post = Posts.findOne(); // Get instance of Post class
```

However you can turn off that behavior by setting `transform` flag to `false` in the class schema.

```js
Posts = new Mongo.Collection('posts');
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: false
});

var post = Posts.findOne(); // Get instance of Post class
```

If you want to have automatic documents transformation turned on and you need to get a plain object you can force that for a particular query by passing `null` as a value of the `transform` option.

```js
var plainPostDoc = Posts.findOne({}, {
  transform: null // Pass null to disable transformation
});
```

#### Constructor

We can define class constructor that will be executed every time the new object of our class is created. The constructor function receives all the arguments passed to it. During the process of fetching document from collection, the first argument is plain mongo document.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  init: function(attrs) { // Constructor
    alert('Creating instance!');
  }
});

var post = new Post(); // Shows alert 'Creating instance!'
```

#### Fields

The model schema is useless without fields definition. We have several ways of defining fields. Let's examine each one.

**Simple list of fields:**

```js
Post = Astronomy.Class({
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
Post = Astronomy.Class({
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
Post = Astronomy.Class({
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
console.log(post.title); // Prints out empty string '' not null.
```

**Adding fields to already defined schema:**

There are situation when we want to add some fields for the schema that is already defined. It can happen when we want to have different set of fields in the client and server.

```js
if (Meteor.isServer) {
  Post.schema.addField('serverOnlyFieldA', {
    type: 'number',
    default: 10
  });

  Post.schema.addField('serverOnlyFieldB', 'string');

  Post.schema.addField('serverOnlyFieldC');

  Post.schema.addFields(['serverOnlyFieldD', 'serverOnlyFieldE', 'serverOnlyFieldF']);
}
```

##### Types

There are few predefined types of fields that you can use to define you class schema. They are:

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
Astronomy.Type({
  name: 'string',
  cast: function(value) {
    return String(value);
  }
});
```

As you can see, we use `Astronomy.Type` method that gets type definition as the only parameter. You have to provide two required attributes in this definition. The first one is the name of the type, that will be used in the field definition. The second one is the cast function, that have to return converted value.

##### Setters and getters

Each fields defined in the schema has its own setter and getter functions. Let's take example.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  fields: ['title', 'commentsCount']
});

var post = new Post();
post.title = 'Title'; // Call field setter.
alert(post.title); // Call field getter.
```

But you can also call setter and getter function directly.

```js
post.set('title', 'New title');
alert(post.get('title'));
```

Setter and getter functions are more powerful. They can take many different arguments and return different data. Let's examine them.

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

We can also tell `get` method fields we want to get.

```js
// Return only "title" and "commentsCount" fields' values.
post.get(['title', 'commentsCount']);
```

##### Modified fields

There are two internal object in each Astronomy document. They are `_values` and `_original`. At the beginning (after fetching or creating new document) both objects are the same (the `_original` object contains copies, not references, of all values in the `_values` object). Modification of any field causes setting new value for that field in the `_values` internal object. Thanks to that, we can compare values in the `_original` and `_values` object and decide what fields had been modified.

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

Adding methods to model is even simpler.

```js
Post = Astronomy.Class({
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
Post.schema.addMethod('methodName', function() {
  // Do something
});

Post.schema.addMethods({
  'methodNameA': function() {
    // Do something
  },
  'methodNameB': function() {
    // Do something
  }
});
```

#### Cloning

To clone a document you have to execute `copy` function on the object.

```js
var post = Posts.findOne();
var copy = post.copy();
```

If original document had already been saved into collection then its copy will have the `_id` attribute cleared. Thanks to that we will be able to save the copy as a new record in the collection.

```js
var post = Posts.findOne();
var copy = post.copy();
console.log(copy._id); // Prints out "undefined".
copy.save(); // Prints out id of the inserted document.
```

We can also automatically save copied document by passing `true` as the first argument of the `copy` function.

```js
var post = Posts.findOne();
var copy = post.copy(true); // Auto save cloned document.
```

We can also create copy of a document using the `EJSON.clone` function but in this case the `_id` attribute won't be cleared.

```js
var post = Posts.findOne();
var copy = EJSON.clone(post);
console.log(copy._id === post._id); // Prints out "true".
```

#### EJSON-ification

The Astronomy objects are registered as a custom EJSON type. It means that every object can be sent from client to server (and vice versa) using the DDP protocol. An example use of this feature was described in the [Examples](#examples) section.

The EJSON-ification of Astronomy objects requires special treatment. The default implementation has to convert an object into the JSON type and allow the object's recreation when it's needed. We do it by storing some important informations:

- the class name that was used to create object's instance
- internal `_original` and `_values` objects

These informations are minimum and every module written for Meteor Astronomy should take EJSON-ification into account and store an additional data if it's needed to recreated the object in its original state. We can do it thanks to a special events, that we can hook into. There are two main functions dealing with EJSON-inification [`toJSONValue`](http://docs.meteor.com/#/full/ejson_type_toJSONValue) and [`fromJSONValue`](http://docs.meteor.com/#/full/ejson_add_type). You can read more about them in the Meteor [documentation](http://docs.meteor.com/#/full/ejson).

Let's take an example module that add some extra data during the process of EJSON-ification.

```js
var onToJSONValue = function(e) {
  e.data.errors = this._errors;
};

var onFromJSONValue = function(e) {
  this._errors = e.data.errors;
};

Astro.on('tojsonvalue', onToJSONValue);
Astro.on('fromjsonvalue', onFromJSONValue);
```

As you can see each event receives the event object that contains the "data" attribute. This is the main object with which we will be working. Let's talk about the `onToJSONValue` function first. We want to convert our object into the JSON format. The `e.data` object already stores some information generated by the default `toJSONValue` method. It contains three values `class`, `original` and `values`. We can extend this object with some extra data. We have some private errors object stored in `this._errors`. We want these errors to be passed through the DDP protocole. To do that, we have to extend the `e.data` object like in the example.

We've done with this function half of the job. Now, we have to recover object from the JSON format. It's the opposite operation which you can see implemented in the `onFromJSONValue` function. We take the `e.data.errors` attribute and put back in our object (`this`) on its place `this._errors = e.data.errors`.

#### Reactivity and reloading

As you may know the collection's `find` method returns Mongo cursor which is reactive. The Meteor Astronomy library doesn't change anything here - cursors are still reactive.

```js
Template.main.helpers({
  posts: function() {
    var cursor = Posts.find(); // Get reactive cursor in the reactive context.
    return cursor;
  }
});
```

Now take a look at the code below. This code is also reactive beacuse it's called in the reactive context (helper function). In fact, it doesn't matter if you use Meteor Astronomy or not, the below code will be reactive.

```js
Template.main.helpers({
  posts: function() {
    var doc = Posts.findOne(); // Get document in the reactive context.
    return doc;
  }
});
```

However there are situations when you get an object from the collection outside of the reactive context. If anyone will modify this document in the database, we won't be notified about that change. There are situation when you want to make sure that the document's state is the same as the one stored in the collection on the server. You can always update given document to its most recent version by executing the `reload` method.

```js
var post = Posts.findOne(); // Get document outside of the reactive context.
post.reload(); // Update document to its most recent state.
```

Standard JavaScript documents/object as well as Meteor Astronomy documents/objects are not reactive. When getting such object not from the reactive Mongo cursor (example code below) it won't update UI reactively.

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

We can also pass a callback function like we could normally do when using `insert`, `update` or `remove` methods.

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

There are eight events that can be called during the operations on collections: `beforesave`, `beforeinsert`, `beforeupdate`, `beforeremove`, `aftersave`, `afterinsert`, `afterupdate`, `afterremove`. Their names are self explanatory. We can hook into process of saving, inserting, updating and removing of a document.

```js
Post = Astronomy.Class({
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
Post = Astronomy.Class({
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
Astro.on('afterset', function(e) {
  console.log('The "' + e.data.field + '" had been set to "' + e.data.value + '" on the object of the "' + this.constructor.schema.getName() + '" class');
});

var post = new Post();
post.title = 'title'; // The "afterset" event triggered.

var item = new Item();
item.name = 'name'; // The "afterset" event triggered.

var car = new Car();
car.wheels = 4; // The "afterset" event triggered.
```

##### Events propagation

Meteor Astronomy events work almost like the regular JavaScript events and you can also stop their propagation. Every event handler receives `EventData` object as its first arguments. The event data object has `stopPropagation` method that stops execution of any further events of given type on given object util the next event occurrence.

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

Post.schema.addEvent('beforesave', function(e) {
  console.log('Second event that will not be executed because of the stopped event propagation');
});

var post = new Post();
post.save(); // Only first event handle will be executed.
```

It is also important in which order event propagation occurs.

1. At first event is triggered on the document that caused event to occur.
2. When the event's propagation hadn't been stopped then we check if given document has any parent class. If it does then we invoke the event on a parent class if it has an event handler defined for the given event name.
3. We repeat step 2 until we reach the last parent class.
4. Lastly a global event is invoked (if defined).

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

Astro.on('beforesave', function() {
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

Inheritance is as simple as telling what model definition to extend. Documents of child and parent classes are stored in the same collection. The distinction what document is of which type is done by looking at the special `_type` attribute that is automatically defined on inherited documents. You shoudn't make any changes to this attribute.

```js
Parent = Astronomy.Class({
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

Almost every Astronomy feature had been written as a module. Such approach gives a lot of flexibility when creating applications. We can choose what features do we need and add them to the project. Thanks to that, we can minimize application size and load time. Let's discuss some external modules that are not the part of core Meteor Astronomy package.

#### Validators

Validators are nice way of checking fields values' validity. For instance, we can check whether given field value is an email string or matches given regular expression. You can also write your own validators.

Validators have been implemented as Meteor Astronomy module. You can add it to your Meteor project using following command.

```sh
$ meteor add jagi:astronomy-validators
```

To read more about Meteor Astronomy Validators go to the module [repository](https://github.com/jagi/meteor-astronomy-validators).

There is also a way of adding validators in the form of string rules which is more concise but in the same time less flexible. The package that provides such feature is called Meteor Astronomy Simple Validators and can be added to the projec using following command.

```sh
$ meteor add jagi:astronomy-simple-validators
```

To read more about Meteor Astronomy Simple Validators go to the module [repository](https://github.com/jagi/meteor-astronomy-simple-validators).

#### Behaviors

Behaviors are nice way of reusing your code for more than one model. If you have similar features in two or more schemas, you should consider creating behavior for such feature. An example of good behavior can be `createdAt` and `updateAt` fields which should be filled with the current date on document save and on every document update. And it's why we've created `Timestamp` behavior for that.

Behaviors have been implemented as Meteor Astronomy module. You can add it to your Meteor project using following command.

```sh
$ meteor add jagi:astronomy-behaviors
```

To read more about Meteor Astronomy Behaviors go to module [repository](https://github.com/jagi/meteor-astronomy-behaviors).

#### Writing modules

Meteor Astronomy is highly modularized. Any developer can write its own modules that extends Astronomy functionality. Developer can easily hook into the process of initialization of module, schema, class and instance of given class. Let's take a look how the `methods` feature had been implemented.

First, we define some extra methods in the schema prototype.

```js
onInitModule = function() {
  var prototype = Astro.Schema.prototype;

  prototype.getMethod = function(methodName) {
    /* ... */
  };

  prototype.getMethods = function() {
    /* ... */
  };

  prototype.addMethod = function(methodName, method) {
    if (!_.isString(methodName)) {
      return;
    }
    if (!_.isFunction(method)) {
      return;
    }

    this._methods[methodName] = method;
    this.getClass().prototype[methodName] = method;
  };

  prototype.addMethods = function(methods) {
    /* ... */
  };
};
```

Thanks to that, we can create a class and add some methods accessing its schema as in the example below.

```js
Post = Astronomy.Class(/* ... */);
Post.schema.addMethods({
  /* ... */
});
```

As you can see in the `addMethod` function, we add a method to the methods list stored in the private `this._methods` object. To this point methods are only stored in the schema but we can't invoke them. In the next line, we add this method to our class's prototype.

```js
this.getClass().prototype[methodName] = method;
```

In another file we define `onInitSchema` function...

```js
onInitSchema = function(Class, definition) {
  this._methods = {};

  if (_.has(definition, 'methods')) {
    this.addMethods(definition.methods);
  }
};
```
... and `Methods` module that joins everything together.

```js
Astronomy.Module({
  name: 'Methods',
  oninitmodule: onInitModule,
  oninitschema: onInitSchema
});
```

We have to name the module. In our example it's `Methods`.

We can define few useful methods in the module definition. They are:

- `oninitmodule`
- `oninitschema`
- `oninitclass`
- `oninitinstance`

Each method is executed in different context. The invocation context is related to the name of method.

- `oninitmodule` - `this` points to `window` object
- `oninitschema` - `this` points to class's schema
- `oninitclass` - `this` points to the class
- `oninitinstance` - `this` points to class's instance (document being created)

As you can see in the `Methods` module definition we have the `oninitschema` function defined. We create the private `this._methods` object in the class's schema and add methods from the schema definition that a user has provided. As you can see the `oninitschema` function is called in the context of the current class schema (in other words `this` is the class schema).

The best way to learn how to write own modules is investigating existing modules.

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create issue or pull request.

## License

MIT
