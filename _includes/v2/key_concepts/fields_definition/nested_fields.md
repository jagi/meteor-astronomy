# Nested fields

MongoDB is a document-oriented database. This allows you to not only store plain values in fields also objects and arrays and Astronomy have a nice syntax for allowing that.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    address: {
      type: Object,
      default: function() {
        return {};
      }
    },
    phones: {
      type: [String],
      default: function() {
        return [];
      }
    }
  }
});
```

In this example, we've defined the `address` field that can store any JavaScript object and the `phones` field that can store arrays of strings. In the square brackets you can use any available type like: `Number`, `Date`, `Object`, `Boolean`.

**Nested classes**

In the previous example, we showed how to define a field to store a JavaScript object. But, what if we want to provide more schema for such a field. We may want to have `city` and `state` fields and check their validity.

```js
import { Class } from 'meteor/jagi:astronomy';

const Address = Class.create({
  name: 'Address',
  /* No collection attribute */
  fields: {
    city: {
      type: String
    },
    state: {
      type: String
    }
  }
});

const User = Class.create({
  name: 'User',
  collection: Users,
  fields: {
    address: {
      type: Address
    }
  }
});
```

As you can see, we can use class constructor as a type. It's true for all the classes defined with Astronomy. They are automatically registered as a new type.

Now let's try defining the `User` class, that has the `addresses` field for storing an array of addresses.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  collection: Users,
  fields: {
    addresses: {
      type: [Address]
    }
  }
});
```