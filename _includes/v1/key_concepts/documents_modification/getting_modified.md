# Getting modified

An Astronomy instance is aware of a document's state. It knows if a document is new or it's already stored in the database. It also knows which fields have been modified from the last save operation. The `getModfied()` method allows you to retrieve modified fields.

```js
var user = Users.findOne();
user.firstName; // "Luke"

/* ... */

user.set('firstName', 'John');
user.getModified(); // Returns {firstName: "John"}
```

The method returns an object of key-value pairs where the key is a field name and the value is its new value. But what if we want to retrieve the old values, before the modification? You just have to pass `true` as the first argument of the `getModified` method.

```js
user.getModified(true); // Returns {firstName: "Luke"}
```

**Is document modified?**

You can also check if a document has been modified using the `isModified()` method. Note that this is not a reactive variable.

```js
var user = Users.findOne();
user.isModified(); // false
user.set('firstName', 'John');
user.isModified(); // true
```