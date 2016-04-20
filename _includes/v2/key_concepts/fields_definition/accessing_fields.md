# Accessing fields

Once you have defined a list of fields, you may want to set and get some values from a document. Let's check how to set values on a document.

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