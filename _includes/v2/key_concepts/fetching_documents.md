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

The same as in `find` and `findOne` methods from `Mongo.Collection`, the Astronomy versions can take options as the second argument. Beside the all standard Mongo options Astronomy introduces one more, which is `disableEvents`. By setting it to true, we turn off `beforeFind` and `afterFind` events, about which we will talk more in the [Events](#events) section.

```js
var user = User.findOne({}, {
  disableEvents: true
});
```