Astronomy.Validator({
  name: 'Number',
  requiredOptions: ['field'],
  messages: {
    invalid: '"{value}" is not valid value',
    min: 'Value must be at least {min}',
    max: 'Value must be at most {max}'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    if (!_.isNumber(value)) {
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
