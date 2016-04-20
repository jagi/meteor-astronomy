# Inc

You should always use the `inc()` method to increment values of a field defined as a number type. Let's take a look at an example:

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    age: {
      type: 'number',
      default: 0
    }
  }
});

var user = new User();
user.inc('age', 2);
```

In the code above, we've incremented a value of the `age` field by 2. Astronomy will not allow modification of non-numeric fields using the `inc()` method.

**Incrementing multiple fields at once**

You can also increment values of multiple fields at once. Instead passing a field name and a number you pass an object with key-value pairs where the key is a field name and the value is a number by which you want to increment the given field.

```js
user.inc({
  'age': -2,
  'rank': 10
});
```

**Incrementing nested fields**

Incrementing nested fields is the same as setting a nested field. We use the "." notation to access nested fields. Here's an example.

```js
user.inc('nested.field', -2);
```