Astronomy.Validator({
  name: 'Number',
  messages: {
    min: 'Value must be at least %min%',
    max: 'Value must be at most %max%'
  },
  validate: function(value, options, messages) {
    if (_.has(options, 'min') && value < options.min) {
      throw new Astronomy.ValidationError(messages.min);
    }

    if (_.has(options, 'max') && value > options.max) {
      throw new Astronomy.ValidationError(messages.max);
    }
  }
});
