Tinytest.add('Validators - Init', function(test) {
  Astro.classes = [];

  ValidatorCollection = new Mongo.Collection(null);

  ValidatorItem = Astro.Class({
    name: 'ValidatorItem',
    collection: ValidatorCollection,
    fields: {
      // Type validators.
      'string': {
        type: null,
        validators: Validators.string()
      },
      'number': {
        type: null,
        validators: Validators.number()
      },
      'boolean': {
        type: null,
        validators: Validators.boolean()
      },
      'array': {
        type: null,
        validators: Validators.array()
      },
      'object': {
        type: null,
        validators: Validators.object()
      },
      'date': {
        type: null,
        validators: Validators.date()
      },
      'email': {
        type: null,
        validators: Validators.email()
      },
      // Existence validators.
      'required': {
        type: null,
        validators: Validators.required()
      },
      'null': {
        type: null,
        validators: Validators.null()
      },
      'notNull': {
        type: null,
        validators: Validators.notNull()
      },
      'has': {
        type: null,
        validators: Validators.has('property')
      },
      // Size validators.
      'length': {
        type: null,
        validators: Validators.length(2)
      },
      'minLength': {
        type: null,
        validators: Validators.minLength(2)
      },
      'maxLength': {
        type: null,
        validators: Validators.maxLength(2)
      },
      'gt': {
        type: null,
        validators: Validators.gt(2)
      },
      'gte': {
        type: null,
        validators: Validators.gte(2)
      },
      'lt': {
        type: null,
        validators: Validators.lt(2)
      },
      'lte': {
        type: null,
        validators: Validators.lte(2)
      },
      // Comparison validators.
      'choice': {
        type: null,
        validators: Validators.choice(['a', 'b', 'c'])
      },
      'unique': {
        type: null,
        validators: Validators.unique()
      },
      'equal': {
        type: null,
        validators: Validators.equal('abc')
      },
      'equalTo': {
        type: null,
        validators: Validators.equalTo('equal')
      },
      'regexp': {
        type: null,
        validators: Validators.regexp(/^[0-9]+$/)
      },
      // Logical validators.
      'and': {
        type: null,
        validators: Validators.and([
          Validators.required(),
          Validators.number()
        ])
      },
      'or': {
        type: null,
        validators: Validators.or([
          Validators.boolean(),
          Validators.number()
        ])
      }
    }
  });
});
