Tinytest.add('Simple Validators - Parser', function(test) {
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

  var expected = [
    'string',
    'number',
    'boolean',
    'date',
    'email',
    'required',
    'null',
    'notNull',
    'has',
    'length',
    'minLength',
    'maxLength',
    'gt',
    'gte',
    'lt',
    'lte',
    'unique',
    'equal',
    'equalTo',
    'and'
  ];

  test.equal(_.keys(SimpleValidatorItem.getValidators()), expected,
    'Not all validators have been parsed'
  );

  // Type validators.
  test.equal(
    SimpleValidatorItem.getValidator('string').param[0].validator.name,
    'string',
    'The "string" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('number').param[0].validator.name,
    'number',
    'The "number" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('boolean').param[0].validator.name,
    'boolean',
    'The "boolean" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('date').param[0].validator.name,
    'date',
    'The "date" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('email').param[0].validator.name,
    'email',
    'The "email" validator has not been parsed properly'
  );

  // Existence validators.
  test.equal(
    SimpleValidatorItem.getValidator('required').param[0].validator.name,
    'required',
    'The "required" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('null').param[0].validator.name,
    'null',
    'The "null" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('notNull').param[0].validator.name,
    'notNull',
    'The "notNull" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('has').param[0].validator.name,
    'has',
    'The "has("property")" validator has not been parsed properly'
  );

  // Size validators.
  test.equal(
    SimpleValidatorItem.getValidator('length').param[0].validator.name,
    'length',
    'The "length(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('minLength').param[0].validator.name,
    'minLength',
    'The "minLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('maxLength').param[0].validator.name,
    'maxLength',
    'The "maxLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gt').param[0].validator.name,
    'gt',
    'The "gt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gte').param[0].validator.name,
    'gte',
    'The "gte(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lt').param[0].validator.name,
    'lt',
    'The "lt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lte').param[0].validator.name,
    'lte',
    'The "lte(2)" validator has not been parsed properly'
  );

  // Comparison validators.
  test.equal(
    SimpleValidatorItem.getValidator('unique').param[0].validator.name,
    'unique',
    'The "unique" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equal').param[0].validator.name,
    'equal',
    'The "equal("abc")" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equalTo').param[0].validator.name,
    'equalTo',
    'The "equalTo("equal")" validator has not been parsed properly'
  );

  // Logical validators.
  test.equal(
    SimpleValidatorItem.getValidator('and').param[0].validator.name,
    'required',
    'The "required,number" validator has not been parsed properly'
  );
});
