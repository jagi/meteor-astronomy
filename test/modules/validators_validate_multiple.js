Tinytest.add('Validators - Validate multiple', function(test) {
  // Reset Astronomy.
  reset();

  var ValidatorCollection = new Mongo.Collection(null);

  var NestedValidator = Astro.Class({
    name: 'NestedValidator',
    fields: {
      'string': {
        validator: Validators.string()
      },
      'number': {
        validator: Validators.number()
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
        validator: Validators.object()
      },
      'has': {
        type: 'object',
        validator: Validators.has('property')
      },
      'array': {
        type: 'array',
        nested: 'NestedValidator',
        validator: Validators.array()
      },
      'contains': {
        type: 'array',
        validator: Validators.contains('abc')
      },
      'every': {
        type: 'array',
        validator: Validators.every(
          Validators.string()
        )
      },
      'notRequired': {
        optional: true,
        validator: Validators.length(2)
      },
      // Type validators.
      'string': {
        validator: Validators.string()
      },
      'number': {
        validator: Validators.number()
      },
      'boolean': {
        validator: Validators.boolean()
      },
      'date': {
        validator: Validators.date()
      },
      'email': {
        validator: Validators.email()
      },
      // Existence validators.
      'required': {
        validator: Validators.required()
      },
      'null': {
        validator: Validators.null()
      },
      'notNull': {
        validator: Validators.notNull()
      },
      // Size validators.
      'length': {
        validator: Validators.length(2)
      },
      'minLength': {
        validator: Validators.minLength(2)
      },
      'maxLength': {
        validator: Validators.maxLength(2)
      },
      'gt': {
        validator: Validators.gt(2)
      },
      'gte': {
        validator: Validators.gte(2)
      },
      'lt': {
        validator: Validators.lt(2)
      },
      'lte': {
        validator: Validators.lte(2)
      },
      // Comparison validators.
      'choice': {
        validator: Validators.choice(['a', 'b', 'c'])
      },
      'unique': {
        validator: Validators.unique()
      },
      'equal': {
        validator: Validators.equal('abc')
      },
      'equalTo': {
        validator: Validators.equalTo('equal')
      },
      'equalFunction': {
        validator: Validators.equal(function() {
          return this.get('equal');
        })
      },
      'regexp': {
        validator: Validators.regexp(/^[0-9]+$/)
      },
      // Logical validators.
      'and': {
        validator: Validators.and([
          Validators.required(),
          Validators.number()
        ])
      },
      'or': {
        validator: Validators.or([
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
