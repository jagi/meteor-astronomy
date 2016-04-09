# Pull

You should always use the `pull()` method to pull values from the fields of array type. Let's take a look at the example.  As of version 1.2.3,  `pull()` will return an array of matched items.  If there are no matches the empty array will be returned.

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
user.pull('phones', {
  number: 123456789
});
```

In the example above, we've pulled all `Phone` documents with a number `123456789` from the `phones` field.

**Pulling from nested fields**

Pulling values from nested fields follows the same rules as functions previously described. We use the "." notation to access nested fields. Let's take a look at an example:

```js
user.pull('nested.field', valueToPull);
```