Tinytest.add('Validators - Validate multiple', function(test) {
  // Reset Astronomy.
  reset();

  var ValidatorCollection = new Mongo.Collection(null);

  var NestedValidator = Astro.Class({
    name: 'NestedValidator',
    fields: {
      'string': {
        required: true,
        validators: Validators.string()
      },
      'number': {
        required: true,
        validators: Validators.number()
      }
    }
  });

  var ValidatorItem = Astro.Class({
    name: 'ValidatorItem',
    collection: ValidatorCollection,
    fields: {
      'object': {
        type: 'object',
        nested: 'NestedValidator',
        required: true,
        validators: Validators.object()
      },
      'has': {
        type: 'object',
        required: true,
        validators: Validators.has('property')
      },
      'array': {
        type: 'array',
        nested: 'NestedValidator',
        required: true,
        validators: Validators.array()
      },
      'contains': {
        type: 'array',
        required: true,
        validators: Validators.contains('abc')
      },
      'every': {
        type: 'array',
        required: true,
        validators: Validators.every(
          Validators.string()
        )
      },
      'notRequired': {
        validators: Validators.length(2)
      },
      // Type validators.
      'string': {
        required: true,
        validators: Validators.string()
      },
      'number': {
        required: true,
        validators: Validators.number()
      },
      'boolean': {
        required: true,
        validators: Validators.boolean()
      },
      'date': {
        required: true,
        validators: Validators.date()
      },
      'email': {
        required: true,
        validators: Validators.email()
      },
      // Existence validators.
      'required': {
        required: true,
        validators: Validators.required()
      },
      'null': {
        required: true,
        validators: Validators.null()
      },
      'notNull': {
        required: true,
        validators: Validators.notNull()
      },
      // Size validators.
      'length': {
        required: true,
        validators: Validators.length(2)
      },
      'minLength': {
        required: true,
        validators: Validators.minLength(2)
      },
      'maxLength': {
        required: true,
        validators: Validators.maxLength(2)
      },
      'gt': {
        required: true,
        validators: Validators.gt(2)
      },
      'gte': {
        required: true,
        validators: Validators.gte(2)
      },
      'lt': {
        required: true,
        validators: Validators.lt(2)
      },
      'lte': {
        required: true,
        validators: Validators.lte(2)
      },
      // Comparison validators.
      'choice': {
        required: true,
        validators: Validators.choice(['a', 'b', 'c'])
      },
      'unique': {
        required: true,
        validators: Validators.unique()
      },
      'equal': {
        required: true,
        validators: Validators.equal('abc')
      },
      'equalTo': {
        required: true,
        validators: Validators.equalTo('equal')
      },
      'equalFunction': {
        required: true,
        validators: Validators.equal(function() {
          return this.get('equal');
        })
      },
      'regexp': {
        required: true,
        validators: Validators.regexp(/^[0-9]+$/)
      },
      // Logical validators.
      'and': {
        required: true,
        validators: Validators.and([
          Validators.required(),
          Validators.number()
        ])
      },
      'or': {
        required: true,
        validators: Validators.or([
          Validators.number(),
          Validators.boolean()
        ])
      }
    }
  });

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
    'or': 'abc',

    // Embedded.
    'has': {},
    'contains': [],
    'every': [1, 2, 3]
  });

  validatorItem._errors.clear();
  validatorItem.validate();
  test.equal(_.size(validatorItem.getValidationErrors()), 1,
    'Validation of all fields should stop after the first error'
  );

  validatorItem._errors.clear();
  validatorItem.validate(false);
  test.isTrue(_.size(validatorItem.getValidationErrors()) > 1,
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
    'or': true,

    // Embedded.
    'has': {
      property: 'abc'
    },
    'contains': ['abc'],
    'every': ['a', 'b', 'c']
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
