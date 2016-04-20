# Validation order

By default validators are executed in the order of their definition, however we can change it providing a new order under the `validationOrder` property in the class schema. The `validationOrder` property is an array or fields in which validation should take place. Let's take a look at the example below.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  validators: {
    firstName: Validators.minLength(3),
    lastName: Validators.minLength(3),
    birthDate: Validators.date()
  },
  validationOrder: [
    'birthDate',
    'firstName',
    'lastName'
  ]
});
```

Now original validation order will be ignored. You can also pass not complete list of validation order. The lacking validators will be added in the order of their definition.

```js
User = Astro.Class({
  name: 'User',
  /* ... */
  validators: {
    firstName: Validators.minLength(3),
    lastName: Validators.minLength(3),
    birthDate: Validators.date()
  },
  validationOrder: [
    'birthDate'
  ]
});
```

In such situation validation order will be: `birthDate`, `firstName`, `lastName`.