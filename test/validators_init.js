Tinytest.add('Validators - Init', function(test) {
  // Reset Astronomy.
  reset();

  ValidatorCollection = new Mongo.Collection(null);

  NestedValidator = Astro.Class({
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

  ValidatorItem = Astro.Class({
    name: 'ValidatorItem',
    collection: ValidatorCollection,
    embedOne: {
      'object': {
        class: 'NestedValidator',
        required: true,
        validators: Validators.object()
      }
    },
    embedMany: {
      'array': {
        class: 'NestedValidator',
        required: true,
        validators: Validators.array()
      }
    },
    fields: {
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
      'has': {
        required: true,
        validators: Validators.has('property')
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
          Validators.boolean(),
          Validators.number()
        ])
      }
    }
  });
});
