Tinytest.add('Simple Validators - Parser', function(test) {
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
    SimpleValidatorItem.getValidator('string').options[0].definition.name,
    'string',
    'The "string" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('number').options[0].definition.name,
    'number',
    'The "number" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('boolean').options[0].definition.name,
    'boolean',
    'The "boolean" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('date').options[0].definition.name,
    'date',
    'The "date" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('email').options[0].definition.name,
    'email',
    'The "email" validator has not been parsed properly'
  );

  // Existence validators.
  test.equal(
    SimpleValidatorItem.getValidator('required').options[0].definition.name,
    'required',
    'The "required" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('null').options[0].definition.name,
    'null',
    'The "null" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('notNull').options[0].definition.name,
    'notNull',
    'The "notNull" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('has').options[0].definition.name,
    'has',
    'The "has("property")" validator has not been parsed properly'
  );

  // Size validators.
  test.equal(
    SimpleValidatorItem.getValidator('length').options[0].definition.name,
    'length',
    'The "length(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('minLength').options[0].definition.name,
    'minLength',
    'The "minLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('maxLength').options[0].definition.name,
    'maxLength',
    'The "maxLength(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gt').options[0].definition.name,
    'gt',
    'The "gt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('gte').options[0].definition.name,
    'gte',
    'The "gte(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lt').options[0].definition.name,
    'lt',
    'The "lt(2)" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('lte').options[0].definition.name,
    'lte',
    'The "lte(2)" validator has not been parsed properly'
  );

  // Comparison validators.
  test.equal(
    SimpleValidatorItem.getValidator('unique').options[0].definition.name,
    'unique',
    'The "unique" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equal').options[0].definition.name,
    'equal',
    'The "equal("abc")" validator has not been parsed properly'
  );
  test.equal(
    SimpleValidatorItem.getValidator('equalTo').options[0].definition.name,
    'equalTo',
    'The "equalTo("equal")" validator has not been parsed properly'
  );

  // Logical validators.
  test.equal(
    SimpleValidatorItem.getValidator('and').options[0].definition.name,
    'required',
    'The "required,number" validator has not been parsed properly'
  );
});
