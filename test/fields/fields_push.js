Tinytest.add('Fields - Push', function(test) {
  var PushCollection = new Mongo.Collection(null);
  removeAll(PushCollection);

  var NestedPush = Astro.Class({
    name: 'NestedPush',
    fields: {
      array: {
        type: 'array',
        nested: 'string',
        default: function() {
          return [];
        }
      }
    }
  });

  var Push = Astro.Class({
    name: 'Push',
    collection: PushCollection,
    fields: {
      null: {
        type: null,
        default: function() {
          return [];
        }
      },
      string: {
        type: 'string',
        default: ''
      },
      array: {
        type: 'array',
        default: function() {
          return [];
        }
      },
      typedArray: {
        type: 'array',
        nested: 'string',
        default: function() {
          return [];
        }
      },
      classArray: {
        type: 'array',
        nested: 'NestedPush',
        default: function() {
          return [];
        }
      }
    }
  });
  var push = new Push();
  push.save();

  // Non-typed field.
  push.push('null', 1);
  test.equal(push.null, [1],
    'Pushing a value into the non-typed field should succeed'
  );

  // Typed field.
  push.push('string', 1);
  test.equal(push.string, '',
    'Pushing a value into the string field should fail'
  );

  // Non-typed arrays.
  push.push('array', 1);
  test.equal(push.array, [1],
    'Pushing a value into the non-typed array field should succeed'
  );

  // Typed arrays.
  push.push('typedArray', 1);
  test.equal(push.typedArray, ['1'],
    'Pushing a value into the typed array field should succeed'
  );

  // Class arrays.
  push.push('classArray', {});
  test.instanceOf(push.classArray[0], NestedPush,
    'Pushing a value into the class typed array field should succeed'
  );

  // Nested arrays.
  push.push('classArray.0.array', 1);
  test.equal(push.classArray[0].array, ['1'],
    'Pushing a value into the typed array field of the nested field should ' +
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
  push.save();
  var pushPlain = _.omit(PushCollection.findOne({}, {
    transform: null
  }), '_id');
  test.equal(pushPlain, expected,
    'A document with pushed values not saved properly'
  );
});
