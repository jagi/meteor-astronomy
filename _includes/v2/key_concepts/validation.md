# Validation

Validators allows checking validity of fields' values. For instance, we can check whether a value of a given field is a correct email string or if it matches a regular expression. By default Astronomy checks validity of fields' types.

**Validating document**

To validate a document you have to call the `validate()` method from the level of a document. The first argument of the validate method is optional list of options.

```js
var user = new User();
user.validate({
  fields: ['firstName'],
  stopOnFirstError: false,
  simulation: false
});
```

As you can, see the set of options is similar to the set of option in the `save()` method.

- `fields` - List of fields to validate.
- `stopOnFirstError` - Validation should stop after the first validation error. It's `true` by default.
- `simulation` - Validation should be also simulated on the client. It's `true` by default.

The second argument in the `validate()` method is a callback function, which behave in the same way as the one in the `save()` method.

```js
// On the client.
var user = new User();
u.validate(function(err) {
  if (err) {
    // Validation error.
  }
});
```

{% include v2/key_concepts/validation/adding_validators.md %}

{% include v2/key_concepts/validation/generating_errors.md %}

{% include v2/key_concepts/validation/validators_list.md %}

{% include v2/key_concepts/validation/creating_validators.md %}