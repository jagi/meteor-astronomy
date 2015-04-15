Astronomy.Validator({
  name: 'Date',
  messages: {
    min: 'The date must be after %min%',
    max: 'The date must be before %max%'
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
