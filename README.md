# Meteor Astronomy

**Table of Contents**
- [About](#about)
- [Functionalities](#functionalities)
- [Examples](#examples)
- [Installation](#installation)
- [Key Concepts](#key-concepts)
  - [Defining schema](#defining-schema)
    - [Transformation](#transformation)
    - [Constructor](#constructor)
    - [Fields](#fields)
    - [Methods](#methods)
    - [Getting modified fields](#getting-modified-fields)
    - [Cloning](#cloning)
    - [Reactivity and reloading](#reactivity-and-reloading)
    - [Saving, updating and removing](#saving-updating-and-removing)
    - [Events](#events)
    - [Validators](#validators)
    - [Inheritance](#inheritance)
    - [Behaviors](#behaviors)
      - [NestedSet](#nestedset)
      - [Sort](#sort)
      - [Timestamp](#timestamp)
- [Writing behaviors](#writing-behaviors)
- [Extending Astronomy](#extending-astronomy)
- [Contribution](#contribution)
- [License](#license)

## About

Meteor Astronomy is model layer (in [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern) for Meteor.

Why the name Meteor Astronomy? As almost everything related to the Meteor is named with some cosmological term, so this one couldn't be an exception. The model layer in MVC pattern is the description of real objects and the science describing astronomical objects is [Astronomy](http://en.wikipedia.org/wiki/Astronomy).

## Functionalities

- Automatic documents transformation
- Fields definition (type, default value)
- Methods definition
- Events (before/after save, update, insert and remove)
- Modified fields getter
- Documents cloning
- Documents reloading
- Inheritance
- Built in behaviors (NestedSet, Sort, Timestamp)
- Possibility to extend functionality through custom behaviors
- Setters and getters (partially implemented)
- Validators (soon)
- Relations definition (soon)
- Automatic related object fetching (soon)

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
    'title': String, // Define "title" field of String type.
    'votes': {
      type: Number, // Define "votes" field of Number type.
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

**Example 1: Using model with the templates**

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

```handlebars
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

## Installation

```sh
$ meteor add jagi:astronomy
```

## Key Concepts

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

Right now fetching documents from the `Posts` collection will return simple objects. We can change that and tell collection to return instances of our `Post` class.

```js
Posts = new Mongo.Collection('posts');
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true
});

var post = Posts.findOne(); // Get instance of Post class
```

If you ever need to get plain object you can force that for particular query.
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
  transform: true,
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
  transform: true,
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
  transform: true,
  fields: {
    'title': String,
    'createdAt': Date,
    'commentsCount': Number
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
  transform: true,
  fields: {
    'title': {
      type: String,
      default: ''
    },
    'createdAt': {
      type: Date,
      default: null
    },
    'commentsCount': {
      type: Number,
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
    type: Number,
    default: 10
  });
  
  Post.schema.addField('serverOnlyFieldB', String);
  
  Post.schema.addField('serverOnlyFieldC');
  
  Post.schema.addFields(['serverOnlyFieldD', 'serverOnlyFieldE', 'serverOnlyFieldF']);
}
```

#### Methods

Adding methods to model is even simpler then fields.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
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

#### Getting modified fields

Values being set on an instance of our model are not directly saved into object. In fact, there are two private objects `_modified` and `_values` that are responsible for storing modified and actually stored in the collection values. When setting some property value, at first it is stored in the `_modified` object. Thanks to that we can do two things. The first one is the ability to determine what fields have been modified from last save and the second one is not updating unnecessary field. For given document, we only update those fields that had been modified.

```js
var post = Posts.findOne();
post.getModified(); // Returns empty object {}
console.log(post.title); // Prints out 'Hello World!'

post.title = 'New title';
post.getModified(); // Returns {title: 'New title'}

// Get old values for modified fields
post.getModified(true); // Returns {title: 'Hello World!'}
```

#### Cloning

Cloning documents is as easy as executing `clone` function on the object.

```js
var post = Posts.findOne();
var clone = post.clone();
```

However, we can modify object during the cloning process.

```js
var post = Posts.findOne();
var clone = post.clone({
  title: 'New title value'
});
```

We can also automatically save object by setting second argument to `true`.

```js
var post = Posts.findOne();
var clone = post.clone({
  title: 'New title value'
}, true); // Autosave
```

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

Let's move on to the very important process of storing documents in the collection. We manage it by using just two functions `save` and `remove`. Save method knows if given object has already been stored in the collection and if it needs updating or if it's new object and we have to insert it.

```js
var post = new Post();
post.title = 'Title';
post.save(); // Inserts document into collection

post.title = 'New title';
post.save(); // Updates document (updates only modified fields)

post.remove(); // Remove document from collection
```

#### Events

There are eight events that are called when we do operation on the collection: `beforeSave`, `beforeInsert`, `beforeUpdate`, `beforeRemove`, `afterSave`, `afterInsert`, `afterUpdate`, `afterRemove`. Their names are self explanatory. We can hook into process of saving, inserting, updating and removing of the document.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
  fields: ['title'],
  events: {
    beforeSave: function () {
      this.title += '!';
    }
  }
});
```

#### Validators

Soon...

#### Inheritance

Inheritance is as simple as telling what model definition to extend. Documents of child and parent classes are stored in the same collection. The distinction what document is of which type is done by looking at the special `_type` attribute that is automatically defined on inherited documents. You shoudn't make any changes to this attribute.

```js
Parent = Astronomy.Class({
  name: 'Parent',
  collection: Collection,
  transform: true,
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

#### Behaviors

Behaviors aare a nice way of modularizing some features. There are situations where we need the same features in several models. Instead repeating the same code, we can create behavior that implements given feature. Later, we can use such behavior in any model. There are three built in behaviors (more to come) [NestedSet](#nestedset), [Sort](#sort), [Timestamp](#timestamp).

Let's see how to add behavior to our model.

```js
Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
  fields: ['title'],
  behaviors: ['Timestamp']
});
```

We can also pass options to behavior, if it accepts any.

Post = Astronomy.Class({
  name: 'Post',
  collection: Posts,
  transform: true,
  fields: ['title'],
  behaviors: {
    'Timestamp': {}
  }
});

*Right now passing option to behavior is not implemented. In the future you will be able to tell behavior how it should behave, what fields should it create etc.*

##### NestedSet

The NestedSet behavior is responsible for creating tree structures withing collection. You can read more about Nested Sets on the [Wikipedia](http://en.wikipedia.org/wiki/Nested_set_model). Behavior provides only one method `getNode` that returns node object that takes care of all tree management. It has many methods but you will use only few of them.

`getDoc`

`isValidNode`

`isRoot`

`isLeaf`

`hasChildren`

`hasParent`

`getParent`

`hasPrevSibling`

`hasNextSibling`

`getPrevSibling`

`getNextSibling`

`getSiblings`

`getDescendants`

`getChildren`

`getLeftValue`

`setLeftValue`

`getRightValue`

`setRightValue`

`getDepthValue`

`setDepthValue`

`getRootValue`

`setRootValue`

`makeRoot`

`addChild`

`remove`

`insertAsLastChildOf`

`moveAsLastChildOf`

`moveAsPrevSiblingOf`

`moveAsNextSiblingOf`

##### Sort

The Sort behavior helps with the process of sorting documents. It delivers several useful methods to manage sorting.

The `takeOut` method takes document out of the sorted list.

```js
var post = Posts.findOne();
post.takeOut();
```

The `insertAt` method inserts document on the given position in the list.

```js
var post = Posts.findOne();
post.insert(0); // Insert at the beginning of the list
```

The `moveBy` method moves document up or down by given distance.

```js
var post = Posts.findOne();
post.moveBy(2); // Move up by 2
post.moveBy(-2); // Move down by 2
```

The `moveTo` method moves document to given position.

```js
var post = Posts.findOne();
post.moveTo(10); // Moves document to position 10
```

The `moveUp` and `moveDown` methods move document up or down by given distance.

```js
var post = Posts.findOne();
post.moveUp(2); // Move up by 2
post.moveDown(2); // Move down by 2
```

The `moveToTop` and `moveToBottom` methods move document to the top or bottom of the list.

```js
var post = Posts.findOne();
post.moveTop(); // Move to up
post.moveBottom(); // Move to bottom
```

##### Timestamp

This behavior adds to fields to the schema `createdAt` and `updatedAt`. Those fields will be automatically filled with the current date on document insertion and update.

```js
var post = new Post();
post.save();
console.log(post.createdAt); // Prints out date of document saving
```

## Writing behaviors

We will describe process of creating behavior on the simplest one `Timestamp`. In the listing below there is the whole code of this behavior.

```js
Astronomy.Behavior({
  name: 'Timestamp',
  fields: {
    createdAt: null,
    updatedAt: null
  },
  events: {
    beforeInsert: function() {
      this.createdAt = new Date();
    },
    beforeUpdate: function() {
      this.updatedAt = new Date();
    }
  }
});
```

As you can see, the behavior definition is similar to the model definition. We have here mandatory `name` attribute and standard attributes of the model definition: `fields`, `methods`, `events`.

## Extending Astronomy

Meteor Astronomy is highly modularized. Any developer can write its own modules that extends Astronomy functionality. Developer can easily hook into process of initialization of schema. Let's take a look how methods feature had been implemented.

First, we define some extra methods on schema prototype.

```js
var prototype = Astronomy.Schema.prototype;

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
```

As you can see in the `addMethod` function, we add method to methods list stored in the private `this._methods` object.

```js
this._methods[methodName] = method;
```

We also get class for the schema and extend its prototype with the given method.

```js
this.getClass().prototype[methodName] = method;
```

In another file we define our `Methods` module.

```js
Astronomy.Module({
  name: 'Methods',
  initSchema: function(Class, definition) {
    this._methods = {};

    if (_.has(definition, 'methods')) {
      this.addMethods(definition.methods);
    }
  }
});
```

We have to name the module - `Methods` in our example. Next thing we do is hooking into schema initialization process. We create private `this._methods` object and add methods from schema definition that user has provided.

In fact almost every Astronomy feature had been written as a module.

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create issue or pull request.

## License

MIT
