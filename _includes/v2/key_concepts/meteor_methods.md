# Meteor methods (>= 2.2.0)

You can define Meteor methods directly in your class definition. Thanks to that, you can better organize your code. Executing method from the client will call it in both client and server. In previous Astronomy version you had to define helpers/methods and later Meteor methods that wrap these helpers. From version 2.2.0 you can minimize amount of code by putting all the logic in Meteor methods defined on the class level. Let's take a look how to define them.

```js
// user.js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: String,
    lastName: String
  },
  meteorMethods: {
    rename(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
      return this.save();
    }
  }
});
```

Now, we will execute Meteor method in the same way we execute Astronomy helpers.

```js
// client.js
const user = User.findOne();
user.rename('John', 'Smith', (err, result) => {
});
```

As you can see, we pass three arguments to the `rename()` method. The first two arguments are passed to the method. The last one is a callback function which will be execute after server response with the Meteor method result as the second argument of the callback function.

**Server only methods**

You might want to hide some method logic from the client and define Meteor method only on the server.

```js
// user.js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: String,
    lastName: String
  }
});
```

```js
// server.js
User.extend({
  meteorMethods: {
    rename(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
      return this.save();
    }
  }
});
```

In this case calling the `rename` method on the client will throw error.

```js
// client.js
const user = User.findOne();
// Throws "Uncaught TypeError: user.rename is not a function()".
user.rename('John', 'Smith', (err, result) => {
});
```

So how to call this method from the client? There are two special methods designed to help with that. They are `callMethod()` and `applyMethod()`. They work in similar way as `Meteor.call()` and `Meteor.apply()`

```js
// client.js
const user = User.findOne();
user.callMethod('rename', 'John', 'Smith', (err, result) => {
});
// or
user.applyMethod('rename', ['John', 'Smith'], (err, result) => {
});
```

The difference between these two method is that the second one takes an array of arguments.

**The "this" context**

The `this` context in method is a document instance. Astronomy methods does not execute `this.save()` automatically, so if you want to save changes made to the document, you have to execute the `save()` method by yourself.

**Method invocation object**

Sometimes you may need to get method's invocation object, giving you access to such properties like `isSimulation`, `userId` or `unblock()` method which are available in Meteor methods in the `this` context. To get the current invocation object you have to call `DDP._CurrentInvocation.get()`.

```js
import { DDP } from 'meteor/ddp-client';

User.extend({
  meteorMethods: {
    rename(firstName, lastName) {
      const invocation = DDP._CurrentInvocation.get();
      invocation.isSimulation;
      invocation.unblock();
      invocation.userId;
      /* ... */
    }
  }
});
```
