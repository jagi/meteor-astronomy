Astronomy.Validator({
  name: 'String',
  requiredOptions: ['field'],
  messages: {
    invalid: '"{value}" is not valid value',
    min: 'Value must be at least {min, plural,' +
      'one {1 character}' +
      'other {# characters}' +
      '} long',
    max: 'Value must be at most {max, plural,' +
      'one {1 character}' +
      'other {# characters}' +
      '} long'
  },
  validate: function(options, messages) {
    // Get field value.
    var value = this.get(options.field);

    if (!_.isString(value)) {
      throw new Astronomy.ValidationError(messages.invalid);
    }

    if (_.has(options, 'min') && value.length < options.min) {
      throw new Astronomy.ValidationError(messages.min);
    }

    if (_.has(options, 'max') && value.length > options.max) {
      throw new Astronomy.ValidationError(messages.max);
    }
  }
});
