Tinytest.add('Indexes - Add', function(test) {
  // Reset Astro.
  reset();

  var Future = Npm.require('fibers/future');
  var hasIndex = function(Collection, indexName) {
    var raw = Collection.rawCollection();
    var future = new Future();

    raw.indexExists(indexName, function(err, exists) {
      if (err) {
        future.throw(err);
      }

      future.return(exists);
    });

    return future.wait();
  };

  var Indexes = new Mongo.Collection('indexes');

  try {
    Indexes._dropIndex('object');
    Indexes._dropIndex('array');
    Indexes._dropIndex('field');
    Indexes._dropIndex('indexes');
  } catch (e) {}

  var Index = Astro.Class.create({
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
        type: String,
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

  test.isTrue(hasIndex(Indexes, 'field'),
    'Index defined in the field definition should be added'
  );

  test.isTrue(hasIndex(Indexes, 'object'),
    'Index defined in the object field definition should be added'
  );

  test.isTrue(hasIndex(Indexes, 'array'),
    'Index defined in the array field definition should be added'
  );

  test.isTrue(hasIndex(Indexes, 'indexes'),
    'Index defined in the class definition should be added'
  );
});
