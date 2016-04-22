# Events propagation

Events propagation is a mechanism of propagating an event from the top document level down to the level of the most nested document. When you consider the `User` class that has the `address` nested property of the `Address` type, then an event triggered on the level of the `User` class will go down to the `Address` class and down if the `Address` class has any nested fields.

In any moment, we can stop execution of the further event handlers by calling the `e.stopPropagation()` method on an event object passed to the event handler. Thanks to that, event will not propagate to the nested documents.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* */
  fields: {
    address: {
      type: 'Address'
    }
  },
  events: {
    beforeSave(e) {
      e.stopPropagation();
    }
  }
});

const Address = Class.create({
  name: 'Address',
  /* ... */
  events: {
    beforeSave(e) {
      // This event will never get called because we stopped propagation.
    }
  }
});
```

There is also the `e.stopImmediatePropagation()` method on the event object that not only stops propagation but also prevent from executing other events of the same type and on the same level.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* */
  fields: {
    address: {
      type: 'Address'
    }
  },
  events: {
    beforeSave: [
      function(e) {
        e.stopImmediatePropagation();
      },
      function() {
        // This event will never get called.
      }
    ]
  }
});
```