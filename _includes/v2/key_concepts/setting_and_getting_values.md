# Setting and getting values

Once you have defined a list of fields, you may want to set and get some values from a document. Let's check how to set values of a document.

**Setting values**

There is nothing special about setting values of a document. You may do it in a way you would do it with any JavaScript object.

```js
const user = new User();
user.firstName = 'John';
user.address.city = 'San Francisco';
```

However there is the `set()` helper method that can help you with setting nested fields and multiple fields at once.

```js
const user = new User();
user.set('address.city', 'San Francisco');
user.set({
  firstName: 'John',
  lastName: 'Smith'
});
```

You may also set values on document creation.

```js
const user = new User({
  firstName: 'John',
  lastName: 'Smith',
  address: {
    city: 'San Francisco',
    state: 'CA'
  }
});
```

**Pulling values from arrays**

To modify data in Astronomy documents you don't have to use the `set()` method. The `set()` method is only required when you want to perform some additional operation on a data being set like for example casting. It's very common to remove elements from arrays, so we will provide two examples of how to implement it. In the first example we will use pure JS and in the second one the [lodash](https://lodash.com/) library.

```js
// Pure JS
const post = Post.findOne();
// Delete comment which author is Jagi
const index = post.comments.findIndex((comment) => comment.author === 'Jagi');
post.comments.splice(index, 1);
post.save();
```

```js
// Using lodash
const post = Post.findOne();
// Delete comment which author is Jagi
post.comments = _.remove(post.comments, (comment) => comment.author === 'Jagi');
post.save();
```

**Casting values**

Values being set on a document are not casted to the fields' types by default, you have to force this behavior. The `set()` function takes an options object as the last argument.

```js
user.set({
  firstName: 123 // Will be casted to the "123" string
}, {
  cast: true
});
```

In the example above the `123` number will be converted to the `"123"` string, if the type of the `firstName` field is `String`.

You can also cast values on document construction, by passing the options object as the last argument of a document constructor.

```js
const user = new User({
  firstName: 123 // Will be casted to the "123" string
}, {
  cast: true
});
```

**Cloning values**

When setting values using the `set` method or constructor all values will be cloned by default. In most cases it's expected behavior as it makes sure that you don't copy references, which might cause hard to find bugs. However, if you know what you're doing and you want to improve performance of your application you can turn off this option.

```js
const user = new User({
  firstName: 'John'
}, {
  clone: false // It's not needed to clone values being set as they are defined inline.
});

user.set({
  lastName: 'Smith'
}, {
  clone: false // It's not needed to clone values being set as they are defined inline.
}
```

**Merging values**

When setting value for a field, the old value will be overridden by a new one. It's not always expected behavior in a fields of the object/class type. Let's take the `address` field as an example and try updating the `state` field.

```js
const user = new User({
  address: {
    city: 'New York',
    state: 'CA'
  }
});
const addressData = {
  state: 'CA'
};
user.set('address', addressData);
```

In the example above an entire `address` field will be overridden, also the `city` field. To make it work we would have to tell Astronomy explicitly what field we want to update.

```js
user.set('address.state', addressData.state);
```

In this example it will work as expected but sometimes we would just like to use syntax from the previous example and just merge objects instead overriding. In Astronomy 2.3, we've introduced the `merge` option which allows that. Let's take a look at the example.

```js
const addressData = {
  state: 'CA'
};
user.set('address', addressData, {
  merge: true
});
```

Right now the `address` field won't be overridden and instead it will be merged with the object being set. We can also use the `merge` option in the following scenario.

```js
const userData = {
  address: {
    state: 'CA'
  }
};
user.set(userData, {
  merge: true
});
```

It will merge objects at all levels.

**Default values**

When you try to set some field's value to `undefined` using the `set` method but the field has default value defined, it will using default value for this field (it won't use default value if you're doing direct assignment). You might want to turn off this option.

```js
// Default value for the "address" field is "new Address()".
const user = User.findOne();
user.set('address', undefined); // It will set field to "new Address".
user.set('address', undefined, {defaults: false}); // It will set field to "undefined".
```

**Getting values**

Getting values is similar to setting them. We also have here the `get()` helper method that helps with getting multiple and nested values.

```js
const user = User.findOne();
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
const user = User.findOne();
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

The `raw()` method is responsible for getting plain values. You can use it to get a raw copy of the entire document, or a copy of a nested field. This means that even if a given field is defined as a nested Astronomy class, it will return a plain JavaScript object instead.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    name: String,
    address: {
      type: Address,
    }
  }
});

const user = User.findOne();
// Getting a plain value of the "address" field.
user.raw('address'); // {city: 'San Francisco', state: 'CA'}
// Getting a plain copy of the entire document.
user.raw(); // { _id: 'DFoBDDh433YFBbqEp', name: 'John Smith', address: {city: 'San Francisco', state: 'CA'} }
```
