# Pop

You should always use the `pop()` method to pop values from the fields of array type. Let's take a look at the example.  As of version 1.2.3, `pop()` will return the item removed from the array or undefined if there is no such item.

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

var user = Users.findOne();
user.pop('phones', 1);
```

In the example above, we've popped the most top value from the `phones` field. You may wonder what the second argument of the `pop()` method does. It determines if an element should be popped from the top (`1`) or from the bottom (`-1`) of the array. They correspond to the `pop()` and `unshift()` JavaScript methods accordingly.

**Popping from multiple fields at once**

You can also pop values from multiple fields at once. Instead passing a field name and `1` or `-1` number you pass object with key-value pairs where the key is a field name and the value is `1` or `-1`. Let's take a look at an example:

```js
user.pop({
  'phones': 1, // Pop from the top.
  'addresses': -1 // Pop from the bottom.
});
```

**Popping from nested fields**

Popping values from nested fields follows the same rules as functions previously described. We use the "." notation to access nested fields. Let's take a look at an example:

```js
user.pop('nested.field', 1);
```