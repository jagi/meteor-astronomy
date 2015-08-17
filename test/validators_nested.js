Tinytest.add('Validators - Nested validators', function(test) {
  ValidatorNested = Astro.Class({
    name: 'ValidatorNested',
    fields: {
      object: 'Object',
      array: 'Array'
    },
    validators: {
      'object.property': Validators.string(),
      'array.0': Validators.object(),
      'array.$': Validators.object(),
      'array.$.property': Validators.string(),
    }
  });

  var validatorNested = new ValidatorNested();

  test.isFalse(validatorNested.validate('object.property'),
    'Should not pass "object.property" validation'
  );
  test.isFalse(validatorNested.validate('array.0'),
    'Should not pass "array.0" validation'
  );
  validatorNested.set('array', [
    'abc'
  ]);
  test.isFalse(validatorNested.validate('array.$'),
    'Should not pass "array.$" validation'
  );
  validatorNested.set('array', [{
    property: 123
  }]);
  test.isFalse(validatorNested.validate('array.$.property'),
    'Should not pass "array.$.property" validation'
  );

  validatorNested.set('object', {
    property: 'abc'
  });
  validatorNested.set('array', [{
    property: 'abc'
  }, {
    property: 'def'
  }]);
  test.isTrue(validatorNested.validate('object.property'),
    'Should pass "object.property" validation'
  );
  test.isTrue(validatorNested.validate('array.0'),
    'Should pass "array.0" validation'
  );
  test.isTrue(validatorNested.validate('array.$'),
    'Should pass "array.$" validation'
  );
  test.isTrue(validatorNested.validate('array.$.property'),
    'Should pass "array.$.property" validation'
  );
});
