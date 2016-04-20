# Push

You should always use the `push()` method to push values into fields of array type. Let's take a look at the following example:

```js
Phone = Astro.Class({
  name: 'Phone',
  fields: {
    number: 'number'
  }
});

User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    phones: {
      type: 'array',
      nested: 'Phone',
      default: function() {
        return [];
      }
    }
  }
});

var user = new User();
user.push('phones', {
  number: $('#phone').value
});
```

In the code above, we've pushed a value from the input field into the `phones` field. The `phones` field stores many phones number, where each one is an instance of the `Phone` class. A value from the input is a string and will be converted to number because the `push()` methods ensures that data stored in a document has been cast to its proper type.

**Pushing into multiple fields at once**

You can also push values into multiple fields at once. Instead passing a field name and field value you pass object with key-value pairs where the key is a field name and the value is the field's value.

```js
user.push({
  'phones': {
    number: '111222333'
  },
  'addresses': {
    city: 'San Francisco',
    state: 'CA'
  }
});
```

**Pushing into nested fields**

Pushing values into nested fields is the same as setting a nested field. We use the "." notation to access nested fields. Here's an example:

```js
user.push('nested.field', 'value');
```