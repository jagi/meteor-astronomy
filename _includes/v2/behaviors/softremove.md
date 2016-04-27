# Softremove

You can add the `softremove` behavior to your project by executing the following command in your Meteor project directory.

```sh
meteor add jagi:astronomy-softremove-behavior
```

The `softremove` behavior let's you remove a document without deleting it from the collection. Instead it's marked as removed. Removed documents can be excluded from displaying in a template. The behavior comes with following options.

```js
behaviors: {
  softremove: {
    // The field name with a flag for marking a document as removed.
    removedFieldName: 'removed',
    // A flag indicating if a "removedAt" field should be present in a document.
    hasRemovedAtField: true,
    // The field name storing the removal date.
    removedAtFieldName: 'removedAt'
  }
}
```

Let's take a look at the behavior usage.

```js
var user = Users.findOne();
// Sets the "removed" flag to true and saves it into the collection
user.softRemove();
```

Ok, but how to exclude removed document from being fetched. You have to use the `find()` or `findOne()` method defined on the class level.

```js
// Get only not removed users.
var onlyNotRemovedUsers = User.find();
// Get all users.
var allUsers = Users.find();
```

*NOTICE: In the first line, we call the `find()` method from the `User` class and in the second line from the `Users` collection. The `slug` behavior uses the `beforeFind` event to modify selector that will cause fetching only non-removed documents.*

You can also restore a soft removed document.

```js
var user = Users.findOne();
// Sets the "removed" flag to true and saves it into the collection
user.softRemove();

/* ... */

// Later, having the same reference to the document.
user.softRestore();
```