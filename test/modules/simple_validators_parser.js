Tinytest.add('Simple Validators - Parser', function(test) {
  // Reset Astronomy.
  reset();

  var SimpleValidatorItem = Astro.Class({
    name: 'SimpleValidatorItem',
    fields: {
      // Type validators.
      'string': {
        type: null,
        simpleValidator: 'string'
      },
      'number': {
        type: null,
        simpleValidator: 'number'
      },
      'boolean': {
        type: null,
        simpleValidator: 'boolean'
      },
      'date': {
        type: null,
        simpleValidator: 'date'
      },
      'email': {
        type: null,
        simpleValidator: 'email'
      },
      // Existence validators.
      'required': {
        type: null,
        simpleValidator: 'required'
      },
      'null': {
        type: null,
        simpleValidator: 'null'
      },
      'notNull': {
        type: null,
        simpleValidator: 'notNull'
      },
      'has': {
        type: null,
        simpleValidator: 'has("property")'
      },
      // Size validators.
      'length': {
        type: null,
        simpleValidator: 'length(2)'
      },
      'minLength': {
        type: null,
        simpleValidator: 'minLength(2)'
      },
      'maxLength': {
        type: null,
        simpleValidator: 'maxLength(2)'
      },
      'gt': {
        type: null,
        simpleValidator: 'gt(2)'
      },
      'gte': {
        type: null,
        simpleValidator: 'gte(2)'
      },
      'lt': {
        type: null,
        simpleValidator: 'lt(2)'
      },
      'lte': {
        type: null,
        simpleValidator: 'lte(2)'
      },
      // Comparison validators.
      'unique': {
        type: null,
        simpleValidator: 'unique'
      },
      'equal': {
        type: null,
        simpleValidator: 'equal("abc")'
      },
      'equalTo': {
        type: null,
        simpleValidator: 'equalTo("equal")'
      },
      // Logical validators.
      'and': {
        type: null,
        simpleValidator: 'required,number'
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
    SimpleValidatorItem.getValidator('string').validator.name,
    'string',
    'The "string" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('number').validator.name,
    'number',
    'The "number" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('boolean').validator.name,
    'boolean',
    'The "boolean" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('date').validator.name,
    'date',
    'The "date" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('email').validator.name,
    'email',
    'The "email" validator has not been parsed properly'
  );

  // Existence validators.
  test.equal(
    SimpleValidatorItem.getValidator('required').validator.name,
    'required',
    'The "required" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('null').validator.name,
    'null',
    'The "null" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('notNull').validator.name,
    'notNull',
    'The "notNull" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('has').validator.name,
    'has',
    'The "has("property")" validator has not been parsed properly'
  );

  // Size validators.
  test.equal(
    SimpleValidatorItem.getValidator('length').validator.name,
    'length',
    'The "length(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('minLength').validator.name,
    'minLength',
    'The "minLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('maxLength').validator.name,
    'maxLength',
    'The "maxLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gt').validator.name,
    'gt',
    'The "gt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gte').validator.name,
    'gte',
    'The "gte(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lt').validator.name,
    'lt',
    'The "lt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lte').validator.name,
    'lte',
    'The "lte(2)" validator has not been parsed properly'
  );

  // Comparison validators.
  test.equal(
    SimpleValidatorItem.getValidator('unique').validator.name,
    'unique',
    'The "unique" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equal').validator.name,
    'equal',
    'The "equal("abc")" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equalTo').validator.name,
    'equalTo',
    'The "equalTo("equal")" validator has not been parsed properly'
  );

  // Logical validators.
  test.equal(
    SimpleValidatorItem.getValidator('and').validator.name,
    'and',
    'The "required,number" validator has not been parsed properly'
  );
});
