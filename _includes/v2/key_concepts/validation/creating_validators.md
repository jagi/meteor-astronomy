# Creating validators

The set of default validators may not be enough for you, so you can create your own validators. We will show the process of creating validator on the example of the `maxLength` validator. Here is the whole code of the validator.

```js
import _ from 'lodash';
import { Validator } from 'meteor/jagi:astronomy';

Validator.create({
  name: 'maxLength',
  parseParam(param) {
    if (!Match.test(param, Number)) {
      throw new TypeError(
        `Parameter for the "maxLength" validator has to be a number`
      );
    }
  },
  isValid({ value, param }) {
    if (!_.has(value, 'length')) {
      return false;
    }
    return value.length <= param;
  },
  resolveError({ name, param }) {
    return `Length of "${name}" has to be at most ${param}`;
  }
});
```

We have two mandatory attributes. The first one is the `name` attribute. Under this name the validator will be added to the global `Validators` object.

The second mandatory attribute is the `isValid` function. It should return a boolean value indicating if a value of a given field passes validation. As you can see, we also partially check validity of a value passed as an argument. We make sure that the `length` property is present. The `isValid` function receives several useful params as a first argument object.

- doc - a document being validated
- name - a field name being validated
- nestedName - a nested field name being validated
- value - value of a field being validated
- param - param passed to the validator

Using this information you can create very complex validation rules.

There is also the `parseParam` function that check validity of a passed param. It's not mandatory but it's a good practice to check param and throw descriptive error for a developer that will be using a given validator. Thanks to that, it's easier to track errors.

Another attribute is already described method `resolveError`. It's just responsible for generating default error message for a given validator. You need to compose an error message and return it.

**More complex validators**

There are validators like `and` or `or` which work in a little bit different way. As a param they take a list of validators. When you examine code of such validators you will notice that we don't have the `isValid()` method defined.

```js
Validator.create({
  name: 'and',
  /* ... */
  validate({
    doc,
    name,
    value,
    param: validators
  }) {
    _.each(validators, function(validator) {
      // Get validator.
      const validationFunction = Validators[validator.type];
      // Execute single validator.
      validationFunction({
        doc,
        name,
        value,
        param: validator.param
      });
    });
  }
});
```

Instead, we have here the `validate()` method which overrides the default `validate()` method of a validator. Thanks to that we can run multiple validators passed as a param and decide what to do with a result of such validation. You can learn more about that just by examining code of such validators.