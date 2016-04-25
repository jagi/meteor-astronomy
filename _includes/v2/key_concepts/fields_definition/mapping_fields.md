# Mapping fields

Sometimes you way want to map some field name stored in the collection into another field name. It may be a result of changes in the schema during a development of application. Let's say we used to store phone number in the `phoneNumber` field but after some time we decided to change the field name to `phone`. Of course, we could just perform some query and just change field name. But there may be situations where we would like to connect two fields into one (which of course could also be done using some query) and we don't want to mess with the current data in the database. Let's take a look at the example how to map the `phoneNumber` field into `phone`.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    phone: {
      type: String,
      resolve(doc) {
        return doc.phoneNumber;
      }
    }
  }
});
```

And another example with joining the `firstName` and `lastName` fields into one `fullName`.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    fullName: {
      type: String,
      resolve(doc) {
        return doc.firstName + ' ' + doc.lastName;
      }
    }
  }
});
```

As you can see in both examples, we perform fields mapping by providing the `resolve()` method in the field's definition. As the first argument, it receives raw data from a collection. Your responsibility is to return a new value for a field. It's worth noting that, if we're dealing with nested class, the the resolve method for such class will receive only data for a nested field.