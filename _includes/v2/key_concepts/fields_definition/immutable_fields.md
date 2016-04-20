# Immutable fields

If you want some field to be immutable you should set the `immutable` flag in the definition of a field. It won't be possible to change field's value once it has been persisted in the database. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    createdAt: Date,
    immutable: true
  }
});

var user = new User();
// It's possible to set a value.
user.createdAt = new Date('2015-09-14');
// It's possible to change a value as long as it was not save into database.
user.createdAt = new Date('2015-09-15');
user.save();
// Now setting a value will be denied.
user.createdAt = new Date('2015-09-16');
```