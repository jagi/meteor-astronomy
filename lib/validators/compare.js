Astronomy.Validator({
  name: 'Compare',
  requiredOptions: ['fields', 'operator'],
  messages: {
    invalid:
      '"{leftValue}" and "{rightValue}" values does not meet comparison ' +
      'requirement'
  },
  validate: function(options, messages) {
    // Get field value.
    var leftValue = this.get(options.fields[0]);
    var rightValue = this.get(options.fields[1]);

    // Execute comparison of left and right values.
    var result;
    switch (options.operator) {
      case '==':
        result = leftValue == rightValue;
        break;
      case '!=':
        result = leftValue != rightValue;
        break;
      case '===':
        result = leftValue === rightValue;
        break;
      case '!==':
        result = leftValue !== rightValue;
        break;
      case '<':
        result = leftValue < rightValue;
        break;
      case '<=':
        result = leftValue <= rightValue;
        break;
      case '>':
        result = leftValue > rightValue;
        break;
      case '>=':
        result = leftValue >= rightValue;
        break;
    }

    if (!result) {
      throw new Astronomy.ValidationError(messages.invalid);
    }
  }
});
