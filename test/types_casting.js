Tinytest.add('Types - Casting', function(test) {
  Astro.classes = [];

  var Cast = Astro.Class({
    name: 'Cast',
    fields: {
      'string': {
        type: 'String'
      },
      'number': {
        type: 'Number'
      },
      'boolean': {
        type: 'Boolean'
      },
      'date': {
        type: 'Date'
      },
      'array': {
        type: 'Array'
      },
      'object': {
        type: 'Object'
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

/*
  Astro.classes = [];

  var Cast = Astro.Class({
    name: 'Cast',
    fields: {
      'string': {
        type: 'String',
        default: 'string'
      },
      'number': {
        type: 'Number',
        default: 123
      },
      'boolean': {
        type: 'Boolean',
        default: true
      },
      'date': {
        type: 'Date',
        default: new Date(2000, 0, 1)
      },
      'object': {
        type: 'Object',
        default: {}
      },
      'array': {
        type: 'Array',
        default: []
      }
    }
  });

  var cast = new Cast();
  cast.set('string', 123);
  cast.set('number', '123');
  cast.set('boolean', 1);
  cast.set('date', 946681200000);
  cast.set('object', 123);
  cast.set('array', 123);

  test.equal(cast.string, '123',
    'The "string" field\'s value should be casted to string'
  );
  test.equal(cast.number, 123,
    'The "number" field\'s value should be casted to number'
  );
  test.equal(cast.boolean, true,
    'The "boolean" field\'s value should be casted to boolean'
  );
  test.equal(cast.date, new Date(2000, 0, 1),
    'The "date" field\'s value should be casted to date'
  );
  test.instanceOf(cast.object, Number,
    'The "object" field\'s value should be casted to object'
  );
  test.equal(cast.array, [],
    'The "array" field\'s value should be casted to array'
  );
  */
});
