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
- Validators
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

**Example 2: Using model with the templates**

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

**Example 4: Using Meteor Astronomy with Iron Router**

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

```hbs
<div>
  {{#each posts}}
    <p><a href="{{pathFor 'post' data=this.get}}">{{title}}</a></p>
  {{/each}}
</div>
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

### Modules

Almost every Astronomy feature had been written as a module. Such approach gives a lot of flexibility when creating applications. We can choose what features do we need and add them to the project. Thanks to that, we can minimize application size and load time. Let's discuss some external modules that are not the part of core Meteor Astronomy package.

#### Validators

Validators are nice way of checking fields values' validity. For instance, we can check whether given field value is an email string or matches given regular expression. You can also write your own validators.

Validators have been implemented as Meteor Astronomy module. You can add it to your Meteor project using following command.

```sh
$ meteor add jagi:astronomy-validators
```

To read more about Meteor Astronomy Validators go to module [repository](https://github.com/jagi/meteor-astronomy-validators).

#### Behaviors

Behaviors are nice way of reusing your code for more than one model. If you have similar features in two or more schemas, you should consider creating behavior for such feature. An example of good behavior can be `createdAt` and `updateAt` fields which should be filled with the current date on document save and on every document update. And it's why we've created `Timestamp` behavior for that.

Behaviors have been implemented as Meteor Astronomy module. You can add it to your Meteor project using following command.

```sh
$ meteor add jagi:astronomy-behaviors
```

To read more about Meteor Astronomy Behaviors go to module [repository](https://github.com/jagi/meteor-astronomy-behaviors).

#### Writing modules

Meteor Astronomy is highly modularized. Any developer can write its own modules that extends Astronomy functionality. Developer can easily hook into process of initialization of schema. Let's take a look how `methods` feature had been implemented.

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

Thanks to the above code we can write.

```js
Post = Astronomy.Class(/* ... */);
Post.schema.addMethods({
  /* ... */
});
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

We have to name the module. In our example it's `Methods`.

Next thing we do is hooking into schema initialization process. We create private `this._methods` object and add methods from schema definition that user has provided. As you can see `initSchema` function is called in the context of the current class schema (in other words `this` is class schema).

## Contribution

If you have any suggestions or want to write new features or behaviors please contact me, or just create issue or pull request.

## License

MIT
