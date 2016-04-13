# Fetching documents

Once you bind an Astronomy class to a Collection, objects returned from that collection will automatically be converted to instances of the given class. Let's take a look at an example:

```js
Users = new Mongo.CollectionName = new Mongo.Collection('users');
User = Astro.Class({
  name: 'User',
  collection: Users,
  fields: {
    firstName: 'string',
    lastName: 'string'
  }
});

var user = new User();
user.save();

/* ... */

// Fetching document from the collection.
var user = Users.findOne();
// It's not a plain JavaScript object, it's an instance of the User class.
user.set('firstName', 'John');
user.save();
```

As you can see, by binding the `User` class with the `Users` collection using the `collection` property in the class definition, we automatically created a transformation function for the collection.

**Fetching plain JavaScript objects**

However, there are situation when you need a plain JavaScript object. You can do that by passing `null` as the `transform` option.

```js
var user = Users.findOne({}, {
  transform: null
});

user.save(); // TypeError: user.save is not a function.
```