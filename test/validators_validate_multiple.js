Tinytest.add('Validators - Validate multiple', function(test) {
  var validatorItem = new ValidatorItem();

  // NOT PASSING VALIDATION

  // Type.
  validatorItem.set({
    'notRequired': 'a',

    'string': 88,
    'number': 'abc',
    'boolean': 'abc',
    'date': 'abc',
    'email': 'abc',
    'object': null,
    'array': null,

    // Existence.
    'required': undefined,
    'null': 'abc',
    'notNull': null,
    'has': {},

    // Size.
    'length': 'abc',
    'minLength': 'a',
    'maxLength': 'abc',
    'gt': 2,
    'gte': 1,
    'lt': 2,
    'lte': 3,

    // Comparison.
    'choice': 'abc',
    'unique': 'abc',
    'equal': 'abcdef',
    'equalTo': 'abc',
    'equalFunction': 'abc',
    'regexp': 'abc',

    // Logical.
    'and': 'abc',
    'or': 'abc'
  });

  validatorItem._errors.clear();
  validatorItem.validate();
  test.equal(_.size(validatorItem.getValidationErrors()), 1,
    'Validation of all fields should stop after the first error'
  );

  validatorItem._errors.clear();
  validatorItem.validate(false);
  test.equal(_.size(validatorItem.getValidationErrors()),
    _.size(ValidatorItem.getValidators()),
    'Validation of all fields should not stop after the first error'
  );

  validatorItem._errors.clear();
  validatorItem.validate(['string', 'number']);
  test.equal(_.size(validatorItem.getValidationErrors()), 1,
    'Validation of multiple fields should stop after the first error'
  );

  validatorItem._errors.clear();
  validatorItem.validate(['string', 'number'], false);
  test.equal(_.size(validatorItem.getValidationErrors()), 2,
    'Validation of multiple fields should not stop after the first error'
  );

  // PASSING VALIDATION

  validatorItem.set({
    'notRequired': null,

    // Type.
    'string': 'abc',
    'number': 123,
    'boolean': false,
    'date': new Date(),
    'email': 'luke.jagodzinski@gmail.com',
    'object': new NestedValidator({
      string: 'abc',
      number: 123
    }),
    'array': [
      new NestedValidator({
        string: 'abc',
        number: 123
      })
    ],

    // Existence.
    'required': 'abc',
    'null': null,
    'notNull': 'abc',
    'has': {
      property: 'abc'
    },

    // Size.
    'length': 'ab',
    'minLength': 'ab',
    'maxLength': 'ab',
    'gt': 3,
    'gte': 2,
    'lt': 1,
    'lte': 2,

    // Comparison.
    'choice': 'a',
    'unique': '123',
    'equal': 'abc',
    'equalTo': 'abc',
    'equalFunction': 'abc',
    'regexp': '123',

    // Logical.
    'and': 123,
    'or': true
  });

  validatorItem._errors.clear();
  validatorItem.validate();
  test.equal(_.size(validatorItem.getValidationErrors()), 0,
    'Validation of all fields should succeed'
  );

  validatorItem._errors.clear();
  validatorItem.validate(false);
  test.equal(_.size(validatorItem.getValidationErrors()), 0,
    'Validation of all fields with the "stopAfterFristError" flag set to ' +
    'false should succeed'
  );

  validatorItem._errors.clear();
  validatorItem.validate(['string', 'number']);
  test.equal(_.size(validatorItem.getValidationErrors()), 0,
    'Validation of multiple fields should succeed'
  );

  validatorItem._errors.clear();
  validatorItem.validate(['string', 'number'], false);
  test.equal(_.size(validatorItem.getValidationErrors()), 0,
    'Validation of multiple fields with the "stopAfterFristError" flag set ' +
    'to false should succeed'
  );
});
