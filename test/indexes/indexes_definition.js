Tinytest.add('Indexes - Add', function(test) {
  // Reset Astronomy.
  reset();

  var Indexes = new Mongo.Collection('indexes');

  try {
    Indexes._dropIndex('object');
    Indexes._dropIndex('array');
    Indexes._dropIndex('field');
    Indexes._dropIndex('indexes');
  } catch (e) {}

  var Index = Astro.Class({
    name: 'Index',
    collection: Indexes,
    fields: {
      'object': {
        type: 'object',
        index: 1
      },
      'array': {
        type: 'array',
        index: 1
      },
      'field': {
        type: 'string',
        index: 1
      },
      'string': 'string',
      'number': 'number'
    },
    indexes: {
      'indexes': {
        fields: {
          string: 1,
          number: 1
        }
      }
    }
  });

  test.isTrue(Index.hasIndex('field'),
    'Index defined in the field definition should be added'
  );

  test.isTrue(Index.hasIndex('object'),
    'Index defined in the object field definition should be added'
  );

  test.isTrue(Index.hasIndex('array'),
    'Index defined in the array field definition should be added'
  );

  test.isTrue(Index.hasIndex('indexes'),
    'Index defined in the class definition should be added'
  );
});
