Astronomy.Validator({
  name: 'Email',
  messages: {
    invalid: 'Value is invalid'
  },
  validate: function(value, options, messages) {
    var re = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,}$/i;

    if (!re.test(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }
  }
});
