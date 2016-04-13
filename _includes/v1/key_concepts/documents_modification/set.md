# Set

You should always use the `set()` method to set values. First, take a look at the example of a wrong assignment.

```js
// ANTI-EXAMPLE
var user = new User();
user.age = $('#age').value; // WRONG! Never do that!
```

In the listing above, we've assigned value from the input to the `age` field. The type of the `age` field is `number` but we assigned string value. It won't be converted to the number as you would expect.

Now, take a look at the correct example.

```js
var user = new User();
user.set('age', $('#age').value); // CORRECT!
```

The `set()` method takes a field name as the first argument and field value as the second. A string value will be converted to the number during the assignment.

**Setting multiple fields at once**

You can also set multiple fields at once, by providing an object of key-value pairs, where the key is a field name and the value is a field value.

```js
var user = new User();
user.set({
  firstName: 'John',
  lastName: 'Smith',
  age: 30
});
```

**Setting nested fields**

Take a look at the following example, where we have a nested `address` field without class definition.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    'address': {
      type: 'object',
      // No class provided.
      default: function() {
        return {};
      }
    }
  }
});

var user = new User();
user.set('address.city', 'San Francisco');
```

As you can see, we've used the `.` notation to access nested field. In this situation, the `address` field will be filled with an empty object (default value) during the document creation. Later, we assign the `San Francisco` string to the `city` property that does not exist yet. But that's not a problem, as long as the `address` field's value is already an object. Astronomy will add the `city` property and properly assign the string.

**Setting nested fields with specified class**

But what about nested objects that have defined type. We have here two possible approaches. Let's examine them.

```js
User = Astro.Class({
  name: 'User',
  /* */
  embedOne: {
    address: {
      nested: 'Address', // Class provided.
      default: function() {
        return {};
      }
    }
  }
});

var user = new User();
// The same as before.
user.set('address.city', 'San Francisco');
// Use the "set" method from the "address" class.
user.address.set('city', 'San Francisco');
```

With the first solution, you're already familiar.

It the second solution, we access the `address` field directly and execute the `set` method on it. It's possible because the value of the `address` field is an instance of the `Address` class and this class also has the `set` method. For Astronomy it doesn't matter if we set value on the top level or nested object.

**Setting fields on the initialization**

When creating a new document, you can pass as the first argument of the constructor an object with values of the fields, including a document's `_id`. Thanks to that you can insert into collection objects coming from other sources.

```js
var user = new User({
  _id: 'P7gBYncrEPfKTeght',
  firstName: 'John',
  lastName: 'Smith'
});
user.save();
```