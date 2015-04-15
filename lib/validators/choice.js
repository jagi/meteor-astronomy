Astronomy.Validator({
  name: 'Choice',
  requiredOptions: ['field', 'choices'],
  messages: {
    invalid: '"{value}" is not valid value',
    min:
      'At least {min, plural,' +
        'one {1 value}' +
        'other {# values}' +
      '} must be chosen',
    max:
      'At most {max, plural,' +
        'one {1 value}' +
        'other {# values}' +
      '} must be chosen'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    if (_.has(options, 'multiple') && options.multiple) {

      // When we decided to have multichoice, the value has to be an array.
      if (!_.isArray(value)) {
        throw new Astronomy.ValidationError(messages.invalid);
      }

      // If there were min or max options provided then check whether there are
      // at least or at most given numbers of options chosen.
      if (_.has(options, 'min') && value.length < options.min) {
        throw new Astronomy.ValidationError(messages.min);
      }
      if (_.has(options, 'max') && value.length > options.max) {
        throw new Astronomy.ValidationError(messages.max);
      }

      // All the values in the `value` array has to be present in the
      // `options.choices` array.
      var contains = _.every(value, function(val) {
        return _.contains(options.choices, val);
      });
      if (!contains) {
        throw new Astronomy.ValidationError(messages.invalid);
      }

    } else {

      if (!_.contains(options.choices, value)) {
        throw new Astronomy.ValidationError(messages.invalid);
      }

    }
  }
});
