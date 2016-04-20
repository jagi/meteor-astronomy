# Simple validators

The `jagi:astronomy-simple-validators` package is an extension of the core validation package [`jagi:astronomy-validators`](https://atmospherejs.com/jagi/astronomy-validators). The 'jagi:astronomy-validators' package uses functional validators which are fast and powerful. However, they require a little bit more code to be written. There are situations where you can sacrifice all the benefits of functional validators for more concise string validators that come with the `jagi:astronomy-simple-validators` package.

To use the simple validators package you don't have to add the core `jagi:astronomy-validators` package. It's a dependency for the simple validators package and it will be added automatically.

```sh
meteor add jagi:astronomy-simple-validators
```

**Adding simple validators**

We can add simple validators on the level of class or on the level of a field definition. We have here the same rule, as with normal validators, if it goes about the property name for defining validators. If we're defining simple validators on the level of a class we use a plural form `simpleValidators` and when we are adding validator on the level of a field definition then we use a singular form `simpleValidator`. Let's see both definitions.

The class level:

```js
// .
User = Astro.Class({
  name: 'User',
  /* ... */
  simpleValidators: {
    firstName: 'minLength(3)'
  }
});
```

The field level:

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  fields: {
    firstName: {
      type: 'string',
      simpleValidator: 'minLength(3)'
    }
  }
});
```

As you can see, we've added the `minLength` validator to the `firstName` field. The validation rules have to be written in the form of a string. We just write a validator name as it would be a function and pass a parameter in the parentheses. The `minLength` validator is one of many predefined validation functions. Almost all validators from `jagi:astronomy-validators` package can be used in the `jagi:astronomy-simple-validators` package. There are some limitations where we can't use objects as a validator param. In such situation, you have to use functional validators.

**Validation error message**

There is also a way of passing a custom error message to the validator.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  simpleValidators: {
    firstName: {
      rules: 'minLength(5)',
      messages: {
        minLength: 'The first name is too short!'
      }
    }
  }
});
```

As you can see, instead passing a string rules, we pass object with `rules` and `messages` properties. A value of the `messages` property is an object of key-value pairs, where the key is a validator name and the value is an error message for the given validator.

**Complex validation rules**

For now, we've shown how to add a single string validator per field, but what about multiple validation rules. We can create more complex validation rules. One possible way is the `and` validator which is created when we separate validators with the comma sign.

```js
simpleValidators: {
  firstName: 'required,string,minLength(3)'
}
```