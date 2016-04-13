# Creating validators

We will describe a process of creating a validator on the example of the `maxLength` validator. Here is the entire code of the validator.

```js
Astro.createValidator({
  name: 'maxLength',
  validate: function(fieldValue, fieldName, maxLength) {
    if (_.isNull(fieldValue) || !_.has(fieldValue, 'length')) {
      return false;
    }

    return fieldValue.length <= maxLength;
  },
  events: {
    validationError: function(e) {
      var fieldName = e.data.fieldName;
      var maxLength = e.data.param;

      e.setMessage(
        'The length of the value of the "' + fieldName +
        '" field has to be at most ' + maxLength
      );
    }
  }
});

```

We have two mandatory attributes. The first one is the `name` attribute. Under this name the validator will be added to the global `Validators` object.

The second mandatory attribute is the `validate` function. It should return a boolean value indicating if a value of a given field passes validation. The `validate` function receives three arguments: a field's value, a field name and a param. The param argument can be for instance the number with which we are comparing a field's value. In the example of the `maxLength` validator, the param argument is the `maxLength` of the string.

There is also an optional attribute which is the events object with the definition of the `validationError` event. The `validationError` event receives an event object as the first argument. We should generate an error message on validation fail. To generate an error message just use the `e.setMessage()` method.