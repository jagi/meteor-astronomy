Tinytest.add('Indexes - Init', function(test) {
  // Reset Astronomy.
  reset();

  Indexes = new Mongo.Collection('indexes');

  try {
    Indexes._dropIndex('object');
    Indexes._dropIndex('array');
    Indexes._dropIndex('field');
    Indexes._dropIndex('indexes');
  } catch (e) {}

  Index = Astro.Class({
    name: 'Index',
    collection: Indexes,
    embedOne: {
      'object': {
        index: 1
      }
    },
    embedMany: {
      'array': {
        index: 1
      }
    },
    fields: {
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
    'Index defined in the embeded (one) field definition should be added'
  );

  test.isTrue(Index.hasIndex('array'),
    'Index defined in the embeded (many) field definition should be added'
  );

  test.isTrue(Index.hasIndex('indexes'),
    'Index defined in the class definition should be added'
  );
});
