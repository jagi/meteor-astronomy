Astronomy.Validator({
  name: 'Regex',
  requiredOptions: ['field', 'pattern'],
  messages: {
    invalid: '"{value}" is not valid value'
  },
  validate: function(value, options, messages) {
    // Get field value.
    var value = this.get(options.field);

    // Get regular expression.
    var re = options.pattern;

    if (!_.isRegExp(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }

    if (!re.test(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }
  }
});
