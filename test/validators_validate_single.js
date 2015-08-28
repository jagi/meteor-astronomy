Tinytest.add('Validators - Validate single', function(test) {
  (new ValidatorItem({
    'unique': 'abc'
  })).save();

  validatorItem = new ValidatorItem();

  // NOT PASSING VALIDATION

  validatorItem.set('notRequired', 'a');
  test.isFalse(validatorItem.validate('notRequired'),
    'Validation of a non required field but with the value should fail'
  );

  // Type.
  validatorItem.set('string', 88);
  validatorItem.set('number', 'abc');
  validatorItem.set('boolean', 'abc');
  validatorItem.set('date', 'abc');
  validatorItem.set('email', 'abc');
  validatorItem.set('object', null);
  validatorItem.set('array', null);
  test.isFalse(validatorItem.validate('string'),
    'The "string" validator should not pass'
  );
  test.isFalse(validatorItem.validate('number'),
    'The "number" validator should not pass'
  );
  test.isFalse(validatorItem.validate('boolean'),
    'The "boolean" validator should not pass'
  );
  test.isFalse(validatorItem.validate('date'),
    'The "date" validator should not pass'
  );
  test.isFalse(validatorItem.validate('email'),
    'The "email" validator should not pass'
  );
  test.isFalse(validatorItem.validate('object'),
    'The "object" validator should not pass'
  );
  test.isFalse(validatorItem.validate('array'),
    'The "array" validator should not pass'
  );

  // Existence.
  validatorItem.set('required', null);
  validatorItem.set('null', 'abc');
  validatorItem.set('notNull', null);
  validatorItem.set('has', {});
  test.isFalse(validatorItem.validate('required'),
    'The "required" validator should not pass'
  );
  test.isFalse(validatorItem.validate('null'),
    'The "null" validator should not pass'
  );
  test.isFalse(validatorItem.validate('notNull'),
    'The "notNull" validator should not pass'
  );
  test.isFalse(validatorItem.validate('has'),
    'The "has" validator should not pass'
  );

  // Size.
  validatorItem.set('length', 'abc');
  validatorItem.set('minLength', 'a');
  validatorItem.set('maxLength', 'abc');
  validatorItem.set('gt', 2);
  validatorItem.set('gte', 1);
  validatorItem.set('lt', 2);
  validatorItem.set('lte', 3);
  test.isFalse(validatorItem.validate('length'),
    'The "length" validator should not pass'
  );
  test.isFalse(validatorItem.validate('minLength'),
    'The "minLength" validator should not pass'
  );
  test.isFalse(validatorItem.validate('maxLength'),
    'The "maxLength" validator should not pass'
  );
  test.isFalse(validatorItem.validate('gt'),
    'The "gt" validator should not pass'
  );
  test.isFalse(validatorItem.validate('gte'),
    'The "gte" validator should not pass'
  );
  test.isFalse(validatorItem.validate('lt'),
    'The "lt" validator should not pass'
  );
  test.isFalse(validatorItem.validate('lte'),
    'The "lte" validator should not pass'
  );

  // Comparison.
  validatorItem.set('choice', 'abc');
  validatorItem.set('unique', 'abc');
  validatorItem.set('equal', 'abcdef');
  validatorItem.set('equalTo', 'abc');
  validatorItem.set('regexp', 'abc');
  test.isFalse(validatorItem.validate('choice'),
    'The "choice" validator should not pass'
  );
  test.isFalse(validatorItem.validate('unique'),
    'The "unique" validator should not pass'
  );
  test.isFalse(validatorItem.validate('equal'),
    'The "equal" validator should not pass'
  );
  test.isFalse(validatorItem.validate('equalTo'),
    'The "equalTo" validator should not pass'
  );
  test.isFalse(validatorItem.validate('regexp'),
    'The "regexp" validator should not pass'
  );

  // Logical.
  validatorItem.set('and', 'abc');
  validatorItem.set('or', 'abc');
  test.isFalse(validatorItem.validate('and'),
    'The "and" validator should not pass'
  );
  test.isFalse(validatorItem.validate('or'),
    'The "or" validator should not pass'
  );

  // PASSING VALIDATION

  validatorItem._errors.clear();
  validatorItem.set('notRequired', null);
  test.isTrue(validatorItem.validate('notRequired'),
    'Validation of a non required field with the null value should succeed'
  );

  // Type.
  validatorItem.set('string', 'abc');
  validatorItem.set('number', 123);
  validatorItem.set('boolean', false);
  validatorItem.set('date', new Date());
  validatorItem.set('email', 'luke.jagodzinski@gmail.com');
  validatorItem.set('object', new NestedValidator({
    string: 'abc',
    number: 123
  }));
  validatorItem.set('array', [
    new NestedValidator({
      string: 'abc',
      number: 123
    })
  ]);
  test.isTrue(validatorItem.validate('string'),
    'The "string" validator should pass'
  );
  test.isTrue(validatorItem.validate('number'),
    'The "number" validator should pass'
  );
  test.isTrue(validatorItem.validate('boolean'),
    'The "boolean" validator should pass'
  );
  test.isTrue(validatorItem.validate('array'),
    'The "array" validator should pass'
  );
  test.isTrue(validatorItem.validate('object'),
    'The "object" validator should pass'
  );
  test.isTrue(validatorItem.validate('date'),
    'The "date" validator should pass'
  );
  test.isTrue(validatorItem.validate('email'),
    'The "email" validator should pass'
  );

  // Existence.
  validatorItem.set('required', 'abc');
  validatorItem.set('null', null);
  validatorItem.set('notNull', 'abc');
  validatorItem.set('has', {
    property: 'abc'
  });
  test.isTrue(validatorItem.validate('required'),
    'The "required" validator should pass'
  );
  test.isTrue(validatorItem.validate('null'),
    'The "null" validator should pass'
  );
  test.isTrue(validatorItem.validate('notNull'),
    'The "notNull" validator should pass'
  );
  test.isTrue(validatorItem.validate('has'),
    'The "has" validator should pass'
  );

  // Size.
  validatorItem.set('length', 'ab');
  validatorItem.set('minLength', 'ab');
  validatorItem.set('maxLength', 'ab');
  validatorItem.set('gt', 3);
  validatorItem.set('gte', 2);
  validatorItem.set('lt', 1);
  validatorItem.set('lte', 2);
  test.isTrue(validatorItem.validate('length'),
    'The "length" validator should pass'
  );
  test.isTrue(validatorItem.validate('minLength'),
    'The "minLength" validator should pass'
  );
  test.isTrue(validatorItem.validate('maxLength'),
    'The "maxLength" validator should pass'
  );
  test.isTrue(validatorItem.validate('gt'),
    'The "gt" validator should pass'
  );
  test.isTrue(validatorItem.validate('gte'),
    'The "gte" validator should pass'
  );
  test.isTrue(validatorItem.validate('lt'),
    'The "lt" validator should pass'
  );
  test.isTrue(validatorItem.validate('lte'),
    'The "lte" validator should pass'
  );

  // Comparison.
  validatorItem.set('choice', 'a');
  validatorItem.set('unique', '123');
  validatorItem.set('equal', 'abc');
  validatorItem.set('equalTo', 'abc');
  validatorItem.set('regexp', '123');
  test.isTrue(validatorItem.validate('choice'),
    'The "choice" validator should pass'
  );
  test.isTrue(validatorItem.validate('unique'),
    'The "unique" validator should pass'
  );
  test.isTrue(validatorItem.validate('equal'),
    'The "equal" validator should pass'
  );
  test.isTrue(validatorItem.validate('equalTo'),
    'The "equalTo" validator should pass'
  );
  test.isTrue(validatorItem.validate('regexp'),
    'The "regexp" validator should pass'
  );

  // Logical.
  validatorItem.set('and', 123);
  validatorItem.set('or', true);
  test.isTrue(validatorItem.validate('and'),
    'The "and" validator should pass'
  );
  test.isTrue(validatorItem.validate('or'),
    'The "or" validator should pass'
  );
  validatorItem.set('or', 123);
  test.isTrue(validatorItem.validate('or'),
    'The "or" validator should pass'
  );
});
