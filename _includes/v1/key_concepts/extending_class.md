# Extending class

There are situations, when we want to have some differences in a class (additional fields, methods or events) depending on an environment. For example, we may want to have some fields that are only available on the server. Let's take a look at how we can extend a class to achieve that.

```js
// Client and server
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: 'string',
    age: 'number'
  }
});

// Only server
if (Meteor.isServer) {
  User.extend({
    fields: {
      updatedAt: 'date',
      createdAt: {
        type: 'date',
        default: function() {
          return new Date();
        }
      }
    }
  });
}
```

As you can see, we used the `User.extend()` method to add server only fields to the `User` class. The only argument of the `extend()` method is a class schema that extends the class.