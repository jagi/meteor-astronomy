# Meteor Astronomy

**Table of Contents**
- [About](#about)
- [Functionalities](#functionalities)
- [Installation](#installation)
- [Key Concepts](#key-concepts)
  - [Defining schema](#defining-schema)
    - [Transformation](#transformation)
    - [Constructor](#constructor)
    - [Fields](#fields)
    - [Methods](#methods)
    - [Getting modified fields](#getting-modified-fields)
    - [Cloning](#cloning)
    - [Reloading](#reloading)
    - [Saving, updating and removing](#saving-updating-and-removing)
    - [Events](#events)
    - [Validators](#validators)
    - [Inheritance](#inheritance)
    - [Behaviors](#behaviors)
      - [NestedSet](#nestedset)
      - [Sort](#sort)
      - [Timestamp](#timestamp)
- [Writing behaviors](#writing-behaviors)
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

#### Reloading

There are situation when you want to make sure that document's state is the same as the one stored in the collection. You can always update document to its most recent version by executing `reload` method.

```js
var post = Posts.find();
post.reload();
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

Child = Astronomy.Class({
  name: 'Child',
  collection: Collection,
  transform: true,
  extend: Parent,
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

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create issue or pull request.

## License

MIT
