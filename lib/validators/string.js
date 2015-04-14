Astronomy.Validator({
  name: 'String',
  messages: {
    min: 'Value must be at least %min% characters long',
    max: 'Value must be at most %max% characters long'
  },
  validate: function(value, options, messages) {
    if (_.has(options, 'min') && value.length < options.min) {
      throw new Astronomy.ValidationError(messages.min);
    }

    if (_.has(options, 'max') && value.length > options.max) {
      throw new Astronomy.ValidationError(messages.max);
    }
  }
});
