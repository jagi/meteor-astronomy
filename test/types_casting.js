Tinytest.add('Types - Casting', function(test) {
  Astro.classes = [];

  var Cast = Astro.Class({
    name: 'Cast',
    embedOne: {
      'object': {}
    },
    embedMany: {
      'array': {}
    },
    fields: {
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      },
      'boolean': {
        type: 'boolean'
      },
      'date': {
        type: 'date'
      }
    }
  });
  var cast = new Cast();

  cast.set('string', 123);
  test.equal(cast.string, '123',
    'The value of the "string" field after setting it to 123 should become "123"'
  );

  cast.set('number', '123');
  test.equal(cast.number, 123,
    'The value of the "number" field after setting it to "123" should become 123'
  );

  cast.set('boolean', '');
  test.isFalse(cast.boolean,
    'The value of the "boolean" field after setting it to "" should become false'
  );

  cast.set('boolean', '123');
  test.isTrue(cast.boolean,
    'The value of the "boolean" field after setting it to "123" should become true'
  );

  cast.set('boolean', 0);
  test.isFalse(cast.boolean,
    'The value of the "boolean" field after setting it to 0 should become false'
  );

  cast.set('boolean', 1);
  test.isTrue(cast.boolean,
    'The value of the "boolean" field after setting it to 1 should become true'
  );

  cast.set('date', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(cast.date, new Date(2000, 0, 1, 0, 0, 0),
    'The value of the "date" field after setting it to "" should become false'
  );

  cast.set('array', 123);
  test.equal(cast.array, [],
    'The value of the "array" field after setting it to 123 should become []'
  );
});
