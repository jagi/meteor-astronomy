Tinytest.add('Fields - Pop', function(test) {
  var PopCollection = new Mongo.Collection(null);
  removeAll(PopCollection);

  var NestedPop = Astro.Class({
    name: 'NestedPop',
    fields: {
      array: {
        type: 'array',
        nested: 'string',
        default: function() {
          return ['1', '2'];
        }
      }
    }
  });

  var Pop = Astro.Class({
    name: 'Pop',
    collection: PopCollection,
    fields: {
      null: {
        type: null,
        default: function() {
          return [1, 2];
        }
      },
      string: {
        type: 'string',
        default: ''
      },
      array: {
        type: 'array',
        default: function() {
          return [1, 2];
        }
      },
      typedArray: {
        type: 'array',
        nested: 'string',
        default: function() {
          return ['1', '2'];
        }
      },
      classArray: {
        type: 'array',
        nested: 'NestedPop',
        default: function() {
          return [{}, {}];
        }
      }
    }
  });
  var pop = new Pop();
  pop.save();

  // Non-typed field.
  pop.pop('null', 1);
  test.equal(pop.null, [1],
    'Popping a value from the non-typed field should succeed'
  );

  // Typed field.
  pop.pop('string', 1);
  test.equal(pop.string, '',
    'Popping a value from the string field should fail'
  );

  // Non-typed arrays.
  pop.pop('array', 1);
  test.equal(pop.array, [1],
    'Popping a value from the non-typed array field should succeed'
  );

  // Typed arrays.
  pop.pop('typedArray', 1);
  test.equal(pop.typedArray, ['1'],
    'Popping a value from the typed array field should succeed'
  );

  // Class arrays.
  pop.pop('classArray', 1);
  test.instanceOf(pop.classArray[0], NestedPop,
    'Popping a value from the class typed array field should succeed'
  );

  // Nested arrays.
  pop.pop('classArray.0.array', 1);
  test.equal(pop.classArray[0].array, ['1'],
    'Popping a value from the typed array field of the nested field should ' +
    'succeed'
  );

  var expected = {
    null: [1],
    string: '',
    array: [1],
    typedArray: ['1'],
    classArray: [{
      array: ['1']
    }]
  };
  pop.save();
  var popPlain = _.omit(PopCollection.findOne({}, {
    transform: null
  }), '_id');
  test.equal(popPlain, expected,
    'A document with popped values not saved properly'
  );
});
