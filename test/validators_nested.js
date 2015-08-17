Tinytest.add('Validators - Nested validators', function(test) {
  Astro.classes = [];

  ValidatorItem = Astro.Class({
    name: 'ValidatorItem',
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

  var validatorItem = new ValidatorItem();

  test.isFalse(validatorItem.validate('object.property'),
    'Should not pass "object.property" validation'
  );
  test.isFalse(validatorItem.validate('array.0'),
    'Should not pass "array.0" validation'
  );
  validatorItem.array = [
    'abc'
  ];
  test.isFalse(validatorItem.validate('array.$'),
    'Should not pass "array.$" validation'
  );
  validatorItem.array = [{
    property: 123
  }];
  test.isFalse(validatorItem.validate('array.$.property'),
    'Should not pass "array.$.property" validation'
  );

  //////////////////////////////////////////////////////////////////////////////

  validatorItem.object = {
    property: 'abc'
  };
  validatorItem.array = [{
    property: 'abc'
  }, {
    property: 'def'
  }];
  test.isTrue(validatorItem.validate('object.property'),
    'Should pass "object.property" validation'
  );
  test.isTrue(validatorItem.validate('array.0'),
    'Should pass "array.0" validation'
  );
  test.isTrue(validatorItem.validate('array.$'),
    'Should pass "array.$" validation'
  );
  test.isTrue(validatorItem.validate('array.$.property'),
    'Should pass "array.$.property" validation'
  );
});
