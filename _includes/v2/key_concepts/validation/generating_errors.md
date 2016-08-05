# Generating errors

There are several ways of generating an error message when validation fails. Of course, you can always use default error messages that come with validators. However, if you want something more application specific or when you need messages translation, it may be a good idea to generate custom error message. In this section, we will discuss all possible ways of the error message generation.

**String validation message**

The simplest and less flexible way of generating error message is passing a string as the `message` property in the validator's definition. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 3,
        message: 'The first name is too short!'
      }]
    }
  }
});
```

As you can see, we passed the `"The first name is too short!"` string and that's the all we can do here. We can't customize it. So, let's do try generating error message dynamically.

**Generating an error message**

The another attribute of the validator is `resolveError`, which has to be a function. It allows resolving error message on validation time. Let's take a look at the example.

```js
import { Class } from 'meteor/jagi:astronomy';

const User = Class.create({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: String,
      validators: [{
        type: 'minLength',
        param: 3,
        resolveError({ name, param }) {
          return `Length of "${name}" has to be at least ${param}`;
        }
      }]
    }
  }
});
```

As you can see, we have access to some parameters when using the `resolveError` method. In our example we used `name` and `param` and composed error message using them. Remember to always return an error message. Beside two mentioned params there are more to work with.

- `className` - a class name of a document being validated,
- `doc` - a document being validated,
- `name` - a field name being validated,
- `nestedName` - a nested field name being validate,
- `value` - value of a field being validated,
- `param` - param passed to the validator