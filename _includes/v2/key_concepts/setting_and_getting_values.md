# Setting and getting values

Once you have defined a list of fields, you may want to set and get some values from a document. Let's check how to set values of a document.

**Settings values**

There is nothing special about setting values of a document. You may do it in a way you would do it with any JavaScript object.

```js
var user = new User();
user.firstName = 'John';
user.address.city = 'San Francisco';
```

However there is the `set()` helper method that can help you with setting nested fields and multiple fields at once.

```js
var user = new User();
user.set('address.city', 'San Francisco');
user.set({
  firstName: 'John',
  lastName: 'Smith'
});
```

You may also set values on document creation.

```js
var user = new User({
  firstName: 'John',
  lastName: 'Smith',
  address: {
    city: 'San Francisco',
    state: 'CA'
  }
});
```

**Getting values**

Getting values is similar to setting them. We also have here the `get()` helper method that helps with getting multiple and nested values.

```js
var user = User.findOne();
user.firstName; // Get first name.
user.address.city; // Get nested field.
user.get('address.city'); // Get nested field with helper method.
user.get(['firstName', 'lastName']); // Get multiple fields.
```

**Getting modified values**

There are four methods that help with getting modified fields/values.

- `isModified([fieldName])`

When called without arguments `doc.isModified()` will tell you if a document was modified. However, you can pass a field name `user.isModified('firstName')` to determine if a single field was modified. You can also pass nested field name `user.isModified('address.city')`.

- `getModified([old])`

Returns list of all fields that have been modified (including nested fields).

- `getModifiedValues([options])`

Returns values of all modified fields as an object with keys being fields names and values being fields values. The method can take an optional `options` object where you can specify if you want to retrieve `old` values before modification. You can also retrieve `raw` values of nested classes if they were modified.

```js
user.getModifiedValues({ old: true, raw: true });
/*
{
  address: {
    city: "San Francisco",
    state: "CA"
  }
}
*/
```

- `getModifier()`

Returns a modifier for modifications that were performed from the last document save.

```js
var user = User.findOne();
user.firstName = 'John';
user.lastName = undefined;
user.getModified();
/*
{
  $set: {
    firstName: 'John'
  },
  $unset: {
    lastName: ''
  }
}
*/
```

**Getting raw values**

The `raw()` method is responsible for getting a plain value from a nested field. This means that even if a given field is defined as a nested Astronomy class, it will return a plain JavaScript object instead.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    address: {
      type: Address,
    }
  }
});

var user = User.findOne();
// Getting a plain value of the "address" field.
user.raw('address'); // {city: 'San Francisco', state: 'CA'}
```