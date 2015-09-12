Tinytest.add('Fields - Inc', function(test) {
  var IncCollection = new Mongo.Collection(null);
  removeAll(IncCollection);

  var NestedInc = Astro.Class({
    name: 'NestedInc',
    fields: {
      number: {
        type: 'number',
        default: 0
      },
      string: {
        type: 'string',
        default: ''
      }
    }
  });

  var Inc = Astro.Class({
    name: 'Inc',
    collection: IncCollection,
    fields: {
      number: {
        type: 'number',
        default: 0
      },
      string: {
        type: 'string',
        default: ''
      },
      array: {
        type: 'array',
        default: function() {
          return [0];
        }
      },
      object: {
        type: 'object',
        default: function() {
          return {
            number: 0,
            string: ''
          };
        }
      },
      numbersArray: {
        type: 'array',
        nested: 'number',
        default: function() {
          return [0];
        }
      },
      stringsArray: {
        type: 'array',
        nested: 'string',
        default: function() {
          return [''];
        }
      },
      classObject: {
        type: 'object',
        nested: 'NestedInc',
        default: function() {
          return {};
        }
      },
      classArray: {
        type: 'array',
        nested: 'NestedInc',
        default: function() {
          return [{}];
        }
      }
    }
  });

  var inc = new Inc();
  inc.save();

  // First incrementation.
  inc.inc('number', 1);
  test.equal(inc.number, 1,
    'Incrementation of a number field by 1 should succeed'
  );
  // Second incrementation.
  inc.inc('number', 1);
  test.equal(inc.number, 2,
    'Second incrementation of a number field should sum up'
  );
  // Incrementation by more than 1.
  inc.inc('number', 2);
  test.equal(inc.number, 4,
    'Incrementation of a number field by more than 1 should succeed'
  );
  // Incrementation by negative number.
  inc.inc('number', -2);
  test.equal(inc.number, 2,
    'Incrementation of a number field by more by negative number should succeed'
  );
  // Incrementation of non number field.
  inc.inc('string', 1);
  test.equal(inc.string, '',
    'Incrementation of a string field should fail and value should not change'
  );

  // Non typed nested fields.
  inc.inc('object.number', 1);
  test.equal(inc.object.number, 1,
    'Incrementation of a number field in a nested object without ' +
    'specified type should succeed'
  );
  inc.inc('object.string', 1);
  test.equal(inc.object.string, '',
    'Incrementation of a string field in a nested object without ' +
    'specified type should fail'
  );

  // Typed nested fields.
  inc.inc('numbersArray.0', 1);
  test.equal(inc.numbersArray[0], 1,
    'Incrementation of a number field in a nested array with ' +
    'specified type should succeed'
  );
  inc.inc('stringsArray.0', 1);
  test.equal(inc.stringsArray[0], '',
    'Incrementation of a string field in a nested array with ' +
    'specified type should fail'
  );

  // Nested fields of a class type.
  inc.inc('classObject.number', 1);
  test.equal(inc.classObject.number, 1,
    'Incrementation of a number field in a nested array with ' +
    'specified class should succeed'
  );
  inc.inc('classObject.string', 1);
  test.equal(inc.classObject.string, '',
    'Incrementation of a string field in a nested array with ' +
    'specified class should fail'
  );
  inc.inc('classArray.0.number', 1);
  test.equal(inc.classArray[0].number, 1,
    'Incrementation of number field in a nested object with ' +
    'specified class should succeed'
  );
  inc.inc('classArray.0.string', 1);
  test.equal(inc.classArray[0].string, '',
    'Incrementation of a string field in a nested object with ' +
    'specified class should fail'
  );

  var expected = {
    array: [0],
    object: {
      number: 1,
      string: ''
    },
    numbersArray: [1],
    stringsArray: [''],
    classObject: {
      number: 1,
      string: ''
    },
    classArray: [{
      number: 1,
      string: ''
    }],
    number: 2,
    string: ''
  };
  inc.save();
  var incPlain = _.omit(IncCollection.findOne({}, {
    transform: null
  }), '_id');
  test.equal(incPlain, expected,
    'A document with incremented values not saved properly'
  );
});
