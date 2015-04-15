Astronomy.Validator({
  name: 'Regex',
  requiredOptions: ['pattern'],
  messages: {
    invalid: 'Invalid value'
  },
  validate: function(value, options, messages) {
    var re = options.pattern;

    if (!re.test(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }
  }
});
