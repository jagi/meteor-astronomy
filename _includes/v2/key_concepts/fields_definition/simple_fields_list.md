# Simple fields list

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: String,
    createdAt: Date,
    age: Number
  }
});
```

In the example above, we passed an object with the fields' names as keys and the fields' types as values. There are several predefined types. You can choose from:

- String
- Number
- Boolean
- Date
- Object
- Mongo.ObjectID

You can also create your own types.