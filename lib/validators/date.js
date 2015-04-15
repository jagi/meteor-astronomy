Astronomy.Validator({
  name: 'Date',
  requiredOptions: ['field'],
  messages: {
    invalid: '"{value}" is not valid value',
    min: 'The date must be after {min}',
    max: 'The date must be before {max}'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    if (!_.isDate(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }

    if (_.has(options, 'min') && value < options.min) {
      throw new Astronomy.ValidationError(messages.min);
    }

    if (_.has(options, 'max') && value > options.max) {
      throw new Astronomy.ValidationError(messages.max);
    }
  }
});
