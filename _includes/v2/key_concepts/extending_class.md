# Extending class

There are situations, when we want to have some differences in a class (additional fields, methods or events) depending on an environment. For example, we may want to have some fields that are only available on the server. Let's take a look at how we can extend a class to achieve that.

```js
// Client and server.
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: String,
    age: Number
  }
});

// Server only.
if (Meteor.isServer) {
  User.extend({
    fields: {
      private: String
    }
  });
}
```

As you can see, we used the `User.extend()` method to add server only field to the `User` class. The only argument of the `extend()` method is a class schema that extends the class.