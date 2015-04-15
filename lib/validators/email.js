Astronomy.Validator({
  name: 'Email',
  requiredOptions: ['field'],
  messages: {
    invalid: '"{value}" is not valid value'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    // Create email regular expression.
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    if (!_.isString(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }

    if (!re.test(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }
  }
});
