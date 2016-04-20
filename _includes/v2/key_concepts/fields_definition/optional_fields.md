# Optional fields

In Astronomy all fields are required by default. To mark a field as optional use the `optional` property.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    address: {
      type: Object,
      optional: true
    }
  }
});
```

Not providing a value for such a field will not throw any validation error. However, when you provide value then it will be validated agains any rules you've defined.