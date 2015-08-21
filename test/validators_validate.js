Tinytest.add('Validators - Validate', function(test) {
  (new ValidatorItem({
    'unique': 'abc'
  })).save();
  validateItem = new ValidatorItem();

  // NOT PASSING VALIDATION

  // Type.
  validateItem.set('string', 88);
  validateItem.set('number', 'abc');
  validateItem.set('boolean', 'abc');
  validateItem.set('date', 'abc');
  validateItem.set('email', 'abc');
  test.isFalse(validateItem.validate('string'),
    'The "string" validator should not pass'
  );
  test.isFalse(validateItem.validate('number'),
    'The "number" validator should not pass'
  );
  test.isFalse(validateItem.validate('boolean'),
    'The "boolean" validator should not pass'
  );
  test.isFalse(validateItem.validate('date'),
    'The "date" validator should not pass'
  );
  test.isFalse(validateItem.validate('email'),
    'The "email" validator should not pass'
  );

  // Existence.
  validateItem.set('required', undefined);
  validateItem.set('null', 'abc');
  validateItem.set('notNull', null);
  validateItem.set('has', {});
  test.isFalse(validateItem.validate('required'),
    'The "required" validator should not pass'
  );
  test.isFalse(validateItem.validate('null'),
    'The "null" validator should not pass'
  );
  test.isFalse(validateItem.validate('notNull'),
    'The "notNull" validator should not pass'
  );
  test.isFalse(validateItem.validate('has'),
    'The "has" validator should not pass'
  );

  // Size.
  validateItem.set('length', 'abc');
  validateItem.set('minLength', 'a');
  validateItem.set('maxLength', 'abc');
  validateItem.set('gt', 2);
  validateItem.set('gte', 1);
  validateItem.set('lt', 2);
  validateItem.set('lte', 3);
  test.isFalse(validateItem.validate('length'),
    'The "length" validator should not pass'
  );
  test.isFalse(validateItem.validate('minLength'),
    'The "minLength" validator should not pass'
  );
  test.isFalse(validateItem.validate('maxLength'),
    'The "maxLength" validator should not pass'
  );
  test.isFalse(validateItem.validate('gt'),
    'The "gt" validator should not pass'
  );
  test.isFalse(validateItem.validate('gte'),
    'The "gte" validator should not pass'
  );
  test.isFalse(validateItem.validate('lt'),
    'The "lt" validator should not pass'
  );
  test.isFalse(validateItem.validate('lte'),
    'The "lte" validator should not pass'
  );

  // Comparison.
  validateItem.set('choice', 'abc');
  validateItem.set('unique', 'abc');
  validateItem.set('equal', 'abcdef');
  validateItem.set('equalTo', 'abc');
  validateItem.set('regexp', 'abc');
  test.isFalse(validateItem.validate('choice'),
    'The "choice" validator should not pass'
  );
  test.isFalse(validateItem.validate('unique'),
    'The "unique" validator should not pass'
  );
  test.isFalse(validateItem.validate('equal'),
    'The "equal" validator should not pass'
  );
  test.isFalse(validateItem.validate('equalTo'),
    'The "equalTo" validator should not pass'
  );
  test.isFalse(validateItem.validate('regexp'),
    'The "regexp" validator should not pass'
  );

  // Logical.
  validateItem.set('and', 'abc');
  validateItem.set('or', 'abc');
  test.isFalse(validateItem.validate('and'),
    'The "and" validator should not pass'
  );
  test.isFalse(validateItem.validate('or'),
    'The "or" validator should not pass'
  );

  // PASSING VALIDATION

  // Type.
  validateItem.set('string', 'abc');
  validateItem.set('number', 123);
  validateItem.set('boolean', false);
  validateItem.set('date', new Date());
  validateItem.set('email', 'luke.jagodzinski@gmail.com');
  test.isTrue(validateItem.validate('string'),
    'The "string" validator should pass'
  );
  test.isTrue(validateItem.validate('number'),
    'The "number" validator should pass'
  );
  test.isTrue(validateItem.validate('boolean'),
    'The "boolean" validator should pass'
  );
  test.isTrue(validateItem.validate('array'),
    'The "array" validator should pass'
  );
  test.isTrue(validateItem.validate('object'),
    'The "object" validator should pass'
  );
  test.isTrue(validateItem.validate('date'),
    'The "date" validator should pass'
  );
  test.isTrue(validateItem.validate('email'),
    'The "email" validator should pass'
  );

  // Existence.
  validateItem.set('required', 'abc');
  validateItem.set('null', null);
  validateItem.set('notNull', 'abc');
  validateItem.set('has', {
    property: 'abc'
  });
  test.isTrue(validateItem.validate('required'),
    'The "required" validator should pass'
  );
  test.isTrue(validateItem.validate('null'),
    'The "null" validator should pass'
  );
  test.isTrue(validateItem.validate('notNull'),
    'The "notNull" validator should pass'
  );
  test.isTrue(validateItem.validate('has'),
    'The "has" validator should pass'
  );

  // Size.
  validateItem.set('length', 'ab');
  validateItem.set('minLength', 'ab');
  validateItem.set('maxLength', 'ab');
  validateItem.set('gt', 3);
  validateItem.set('gte', 2);
  validateItem.set('lt', 1);
  validateItem.set('lte', 2);
  test.isTrue(validateItem.validate('length'),
    'The "length" validator should pass'
  );
  test.isTrue(validateItem.validate('minLength'),
    'The "minLength" validator should pass'
  );
  test.isTrue(validateItem.validate('maxLength'),
    'The "maxLength" validator should pass'
  );
  test.isTrue(validateItem.validate('gt'),
    'The "gt" validator should pass'
  );
  test.isTrue(validateItem.validate('gte'),
    'The "gte" validator should pass'
  );
  test.isTrue(validateItem.validate('lt'),
    'The "lt" validator should pass'
  );
  test.isTrue(validateItem.validate('lte'),
    'The "lte" validator should pass'
  );

  // Comparison.
  validateItem.set('choice', 'a');
  validateItem.set('unique', '123');
  validateItem.set('equal', 'abc');
  validateItem.set('equalTo', 'abc');
  validateItem.set('regexp', '123');
  test.isTrue(validateItem.validate('choice'),
    'The "choice" validator should pass'
  );
  test.isTrue(validateItem.validate('unique'),
    'The "unique" validator should pass'
  );
  test.isTrue(validateItem.validate('equal'),
    'The "equal" validator should pass'
  );
  test.isTrue(validateItem.validate('equalTo'),
    'The "equalTo" validator should pass'
  );
  test.isTrue(validateItem.validate('regexp'),
    'The "regexp" validator should pass'
  );

  // Logical.
  validateItem.set('and', 123);
  validateItem.set('or', true);
  test.isTrue(validateItem.validate('and'),
    'The "and" validator should pass'
  );
  test.isTrue(validateItem.validate('or'),
    'The "or" validator should pass'
  );
  validateItem.set('or', 123);
  test.isTrue(validateItem.validate('or'),
    'The "or" validator should pass'
  );
});
