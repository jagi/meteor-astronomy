# Behaviors

A behavior allows extending a class schema with some extra functionality. Most of the time the functionality is a feature that is repeated over and over again for many classes. If you experience such situation, it may be a good idea to create custom behavior.

You can add behavior to the class in the following way.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  behaviors: {
    behaviorName: {
      /* Behavior options */
    }
  }
});
```

You may also want to add several behaviors of the same time to the same class. Here is how to do it.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  behaviors: {
    behaviorName: [{
      /* 1. behavior options */
    }, {
      /* 2. behavior options */
    }]
  }
});
```

Let's talk about predefined behaviors.

{% include v2/behaviors/timestamp.md %}

{% include v2/behaviors/slug.md %}

{% include v2/behaviors/softremove.md %}