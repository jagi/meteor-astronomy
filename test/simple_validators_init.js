Tinytest.add('Simple Validators - Init', function(test) {
  // Reset Astronomy.
  reset();

  SimpleValidatorItem = Astro.Class({
    name: 'SimpleValidatorItem',
    fields: {
      // Type validators.
      'string': {
        type: null,
        simpleValidators: 'string'
      },
      'number': {
        type: null,
        simpleValidators: 'number'
      },
      'boolean': {
        type: null,
        simpleValidators: 'boolean'
      },
      'date': {
        type: null,
        simpleValidators: 'date'
      },
      'email': {
        type: null,
        simpleValidators: 'email'
      },
      // Existence validators.
      'required': {
        type: null,
        simpleValidators: 'required'
      },
      'null': {
        type: null,
        simpleValidators: 'null'
      },
      'notNull': {
        type: null,
        simpleValidators: 'notNull'
      },
      'has': {
        type: null,
        simpleValidators: 'has("property")'
      },
      // Size validators.
      'length': {
        type: null,
        simpleValidators: 'length(2)'
      },
      'minLength': {
        type: null,
        simpleValidators: 'minLength(2)'
      },
      'maxLength': {
        type: null,
        simpleValidators: 'maxLength(2)'
      },
      'gt': {
        type: null,
        simpleValidators: 'gt(2)'
      },
      'gte': {
        type: null,
        simpleValidators: 'gte(2)'
      },
      'lt': {
        type: null,
        simpleValidators: 'lt(2)'
      },
      'lte': {
        type: null,
        simpleValidators: 'lte(2)'
      },
      // Comparison validators.
      'unique': {
        type: null,
        simpleValidators: 'unique'
      },
      'equal': {
        type: null,
        simpleValidators: 'equal("abc")'
      },
      'equalTo': {
        type: null,
        simpleValidators: 'equalTo("equal")'
      },
      // Logical validators.
      'and': {
        type: null,
        simpleValidators: 'required,number'
      }
    }
  });
});
