# Fetching documents

Once we have Astronomy documents stored in a collection, we may want to retrieve them. The old/standard way of fetching documents does not change when using Astronomy. So calling `Collection.findOne()` will just return plain JavaScript object. In Astronomy 1.0 it used to transform documents to Astronomy class instances. In Astronomy 2.0, we use `Class.findOne()` to retrieve Astronomy documents. It works the same way as `Collection.findOne()` but documents are transformed. Let's take a look at an example.

```js
import { Class } from 'meteor/jagi:astronomy';
import { Mongo } from 'meteor/mongo';

const Users = new Mongo.Collection('users');
const User = Class.create({
  name: 'User',
  collection: Users,
  /* ... */
});
var user = new User();
user.save();

/* ... */

// Fetching document from the collection.
// It's not a plain JavaScript object, it's an instance of the User class.
var user = User.findOne(); // Get single document.
var users = User.find(); // Get cursor.
user.firstName = 'John';
user.save();
```

**Find options**

The same as in `find` and `findOne` methods from `Mongo.Collection`, the Astronomy versions can take options as the second argument. Here is the list of extra options:

- `disableEvents` - by setting it to true, we turn off `beforeFind` and `afterFind` events, about which we will talk more in the [Events](#events) section.

```js
var user = User.findOne({}, {
  disableEvents: true
});
```

- `children` - if you are fetching documents from the class that has some child classes, then you can decide if you want to fetch children or not. You can read more about inheritance in the [Inheritance](#inheritance) section. By default all children are fetched however you can tell Astronomy how many levels deep it should look for children.

```js
Parent.find(); // Fetch children, grand children and so on
Parent.find({}, {
  children: false // Do not fetch children
});
Parent.find({}, {
  children: 1 // Only fetch direct children
});
Parent.find({}, {
  children: 2 // Fetch direct children and grand children
});
```

- `defaults` - option is set to `true` by default and might cause overriding some fields with default values on document update, if you're subscribed only to some set of fields. In such case, it's recommended to set it to `false` which will fill fields that you're not subscribed to with `undefined` values instead of default ones. This options should be set to `false` by default but because of the backward compatibility we can't change it, so you have to be aware of this issue.

```js
// both.js
const Post = Class.create({
  name: 'Post',
  collection: Posts,
  fields: {
    title: String,
    tags: {
      type: [String],
      default() {
        return [];
      }
    }
  }
});

// server.js
Meteor.publish('posts', function() {
  Post.find({}, {fields: {title: 1}});
});

// bad_client.js
Meteor.subscribe('posts');
const post = Post.findOne();
post.name = 'New name';
post.getModifier(); // {$set: {name: 'New name', tags: []}} - it will override tags
post.save();

// good_client.js
Meteor.subscribe('posts');
const post = Post.findOne({}, {defaults: false});
post.name = 'New name';
post.getModifier(); // {$set: {name: 'New name'}} - it will not override tags
post.save();
```
