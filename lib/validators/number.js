Astronomy.Validator({
  name: 'Number',
  options: ['min', 'max'],
  messages: {
    min: 'Value must be at least %min%',
    max: 'Value must be at most %max%'
  },
  validate: function(value, options, messages) {
    if (_.has(options, 'min')) {
      if (value < options.min) {
        throw new Astronomy.ValidationError();
      }
    }

    if (_.has(options, 'max')) {
      if (value > options.max) {
        throw new Astronomy.ValidationError();
      }
    }
  }
});
