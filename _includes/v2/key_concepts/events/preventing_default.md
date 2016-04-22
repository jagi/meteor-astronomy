# Preventing default

There are processes you may want to prevent from occurring. The example of such process may be preventing the save operation, however it's more likely that you will use it in some custom behavior or module with your custom events. For the proof of concept let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* */
  events: {
    beforeSave(e) {
      // Prevent document save.
      e.preventDefault();
    }
  }
});

var user = new User();
// Document won't be saved.
user.save();
```

*NOTE: It's worth noting that the `preventDefault()` method does not stop event propagation.*