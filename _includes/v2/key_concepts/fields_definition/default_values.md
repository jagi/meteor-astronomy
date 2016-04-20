# Default values

If you need to provide more information than just the field's type - let's say a default value, then you can do so. Take a look at the following example:

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: String,
      default: ''
    }
  }
});

var user = new User();
user.firstName; // '' - empty string
```

If we don't provide a default value for a field, then it will be set to `undefined` on document's creation. We can't use JavaScript objects for default values directly. If we want to do so, then we have to use function and return such an object. The function will be executed on document's creation and returned value will be used as the default value.

*NOTE: If you want to set a default value of a field to object (an array is also object) you should always use a function that returns such an object. This is important because values in JavaScript are passed by reference and we want every instance of the class to have its own copy of the object, not one that would be shared among all documents.*

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
    }
  }
});
```