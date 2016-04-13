# Simple fields list

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: ['firstName', 'createdAt', 'age']
});
```

In the example above we've defined three fields. Their types haven't been provided so they can take any value.

We can create an instance of the class and access fields.

```js
var user = new User();
user.firstName; // null
user.createdAt; // null
```