Tinytest.add('Validators - Validate single', function(test) {
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
      'numberCast': {
        type: 'number',
        validator: Validators.number()
      },
      'boolean': {
        validator: Validators.boolean()
      },
      'date': {
        validator: Validators.date()
      },
      'dateCast': {
        type: 'date',
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
      },
      'if': {
        validator: Validators.if({
          condition: function() {
            return this.if === 'abc';
          },
          true: Validators.minLength(4),
          false: Validators.number()
        })
      },
      'switch': {
        validator: Validators.switch({
          cases: {
            'abc': Validators.string(),
            123: Validators.number()
          }
        })
      }
    }
  });

  (new ValidatorItem({
    'unique': 'abc'
  })).save();

  var validatorItem = new ValidatorItem();

  // NOT PASSING VALIDATION

  validatorItem.set('notRequired', 'a');
  test.isFalse(validatorItem.validate('notRequired'),
    'Validation of a non required field but with the value should fail'
  );

  // Type.
  validatorItem.set('string', 88);
  validatorItem.set('number', 'abc');
  validatorItem.set('numberCast', 'abc');
  validatorItem.set('boolean', 'abc');
  validatorItem.set('date', 'abc');
  validatorItem.set('dateCast', 'abc');
  validatorItem.set('email', 'abc');
  validatorItem.set('object', null);
  validatorItem.set('array', null);
  test.isFalse(validatorItem.validate('string'),
    'The "string" validator should not pass'
  );
  test.isFalse(validatorItem.validate('number'),
    'The "number" validator should not pass'
  );
  test.isFalse(validatorItem.validate('numberCast'),
    'The "number" validator for the "numberCast" field should not pass'
  );
  test.isFalse(validatorItem.validate('boolean'),
    'The "boolean" validator should not pass'
  );
  test.isFalse(validatorItem.validate('date'),
    'The "date" validator should not pass'
  );
  test.isFalse(validatorItem.validate('dateCast'),
    'The "date" validator for the "dateCast" field should not pass'
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
  test.isFalse(validatorItem.validate('required'),
    'The "required" validator should not pass'
  );
  test.isFalse(validatorItem.validate('null'),
    'The "null" validator should not pass'
  );
  test.isFalse(validatorItem.validate('notNull'),
    'The "notNull" validator should not pass'
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
  validatorItem.set('equalFunction', 'abc');
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
  test.isFalse(validatorItem.validate('equalFunction'),
    'The "equalFunction" validator should not pass'
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
  validatorItem.set('if', 'abc');
  test.isFalse(validatorItem.validate('if'),
    'The "if" validator should not pass'
  );
  validatorItem.set('if', 'abcd');
  test.isFalse(validatorItem.validate('if'),
    'The "if" validator should not pass'
  );

  // Nested.
  validatorItem.set('has', {});
  test.isFalse(validatorItem.validate('has'),
    'The "has" validator should not pass'
  );
  validatorItem.set('contains', []);
  test.isFalse(validatorItem.validate('contains'),
    'The "contains" validator should not pass'
  );
  validatorItem.set('every', [1, 2, 3]);
  test.isFalse(validatorItem.validate('every'),
    'The "every" validator should not pass'
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
  validatorItem.set('numberCast', '123');
  validatorItem.set('boolean', false);
  validatorItem.set('date', new Date());
  validatorItem.set('dateCast', 946681200000);
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
  test.isTrue(validatorItem.validate('numberCast'),
    'The "number" validator for the "numberCast" field should pass'
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
  test.isTrue(validatorItem.validate('dateCast'),
    'The "date" validator for the "dateCast" field should pass'
  );
  test.isTrue(validatorItem.validate('email'),
    'The "email" validator should pass'
  );

  // Existence.
  validatorItem.set('required', 'abc');
  validatorItem.set('null', null);
  validatorItem.set('notNull', 'abc');
  test.isTrue(validatorItem.validate('required'),
    'The "required" validator should pass'
  );
  test.isTrue(validatorItem.validate('null'),
    'The "null" validator should pass'
  );
  test.isTrue(validatorItem.validate('notNull'),
    'The "notNull" validator should pass'
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
  validatorItem.set('equalFunction', 'abc');
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
  test.isTrue(validatorItem.validate('equalFunction'),
    'The "equalFunction" validator should pass'
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
  validatorItem.set('if', 123);
  test.isTrue(validatorItem.validate('if'),
    'The "if" validator should pass'
  );
  validatorItem.set('switch', 'abc');
  test.isTrue(validatorItem.validate('switch'),
    'The "switch" validator should pass'
  );
  validatorItem.set('switch', 123);
  test.isTrue(validatorItem.validate('switch'),
    'The "switch" validator should pass'
  );

  // Nested.
  validatorItem.set('has', {
    property: 'abc'
  });
  test.isTrue(validatorItem.validate('has'),
    'The "has" validator should pass'
  );
  validatorItem.set('contains', ['abc']);
  test.isTrue(validatorItem.validate('contains'),
    'The "contains" validator should pass'
  );
  validatorItem.set('every', ['a', 'b', 'c']);
  test.isTrue(validatorItem.validate('every'),
    'The "every" validator should pass'
  );
});
