**Getting value**

The `get()` method is responsible for getting a value from a document's field. You can still access top level and nested fields directly. However there is an extra feature that comes from using the `get()` method. It's possibility to access a nested field with a string using the "." notation.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    'address': {
      type: 'object',
      nested: 'Address'
    }
  }
});

var user = Users.findOne();
// Getting a value of the "address" field.
user.get('address'); // An instance of the Address class.
```

**Getting multiple fields**

You can also get multiple fields at once by providing an array of fields names.

```js
user.get(['firstName', 'lastName', 'age']);
```

The code above will return an object of key-value pairs, where the key is a field name and the value is a field value.

**Getting nested fields**

The example below shows how you would access nested fields.

```js
var user = new User();
user.set('address', {
  city: 'San Francisco',
  state: 'CA'
});
user.get('address.city'); // Returns "San Francisco".
```

As you can see, we've used the `.` notation to access a nested field. The `get` method will return the `San Francisco` string.