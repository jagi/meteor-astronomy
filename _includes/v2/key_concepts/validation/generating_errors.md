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

**Generating error message for required fields**

When a field is required, then it has the `required` validator assigned to it. In such case, you can't just provided another `required` validator for such a field and provide custom error message. In this section we will describe process of generating error messages for fields that already have some validators assigned.

For that purpose, there is special `resolveError` property declared on the class level which can generate error message for any field in a class. Let's take a look at the example below.

```js
const i18n = {
  messages: {
    'firstName-required': 'Это обязательное поле.'
  },
  get(key) {
    return this.messages[key];
  }
};

const User = Class.create({
  name: 'User',
  fields: {
    firstName: {
      type: String
    }
  },
  resolveError({nestedName, validator}) {
    return i18n.get(`${nestedName}-${validator}`);
  }
});
```

As you can see, the `resolveError` property works the same way as its equivalent in field's definition. So you can access the same properties of a field being validated. We just need to return error message from the function. We also introduced simple mechanism for i18n messages. You can improve it to add another languages.