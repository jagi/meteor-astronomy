Tinytest.add('Fields - Casting', function(test) {
  // Reset Astronomy.
  reset();

  var NestedCast = Astro.Class({
    name: 'NestedCast'
  });

  var Cast = Astro.Class({
    name: 'Cast',
    fields: {
      'object': {
        type: 'object'
      },
      'array': {
        type: 'array',
        nested: 'string'
      },
      'nested': {
        type: 'object',
        nested: 'NestedCast'
      },
      'arrayNested': {
        type: 'array',
        nested: 'NestedCast'
      },
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
    'The casted value of the "string" field is not correct'
  );

  cast.set('number', '123');
  test.equal(cast.number, 123,
    'The casted value of the "number" field is not correct'
  );

  cast.set('boolean', '');
  test.isFalse(cast.boolean,
    'The casted value of the "boolean" field is not correct'
  );

  cast.set('boolean', '123');
  test.isTrue(cast.boolean,
    'The casted value of the "boolean" field is not correct'
  );

  cast.set('boolean', 0);
  test.isFalse(cast.boolean,
    'The casted value of the "boolean" field is not correct'
  );

  cast.set('boolean', 1);
  test.isTrue(cast.boolean,
    'The casted value of the "boolean" field is not correct'
  );

  cast.set('date', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(cast.date, new Date(2000, 0, 1, 0, 0, 0),
    'The casted value of the "date" field is not correct'
  );

  cast.set('object', 123);
  test.isNull(cast.object,
    'The casted value of the "object" field is not correct'
  );

  cast.set('object', {a: 'a'});
  test.equal(cast.object, {a: 'a'},
    'The casted value of the "object" field is not correct'
  );

  cast.set('array', 123);
  test.isNull(cast.array,
    'The casted value of the "array" field is not correct'
  );

  cast.set('array', [123]);
  test.equal(cast.array, ['123'],
    'The casted value of the "array" field is not correct'
  );

  cast.set('nested', {});
  test.instanceOf(cast.nested, NestedCast,
    'The casted value of the "nested" field is not correct'
  );

  cast.set('arrayNested', [{}]);
  test.instanceOf(cast.arrayNested[0], NestedCast,
    'The casted value of the "arrayNested.0" field is not correct'
  );
});
