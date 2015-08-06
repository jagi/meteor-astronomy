Tinytest.add('Types - Casting', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
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
  var item = new Item();

  item.set('string', 123);
  test.equal(item.string, '123',
    'The "string" field\'s value after setting to 123 should become "123"'
  );

  item.set('number', '123');
  test.equal(item.number, 123,
    'The "number" field\'s value after setting to "123" should become 123'
  );

  item.set('boolean', '');
  test.isFalse(item.boolean,
    'The "boolean" field\'s value after setting to "" should become false'
  );

  item.set('boolean', '123');
  test.isTrue(item.boolean,
    'The "boolean" field\'s value after setting to "123" should become true'
  );

  item.set('boolean', 0);
  test.isFalse(item.boolean,
    'The "boolean" field\'s value after setting to 0 should become false'
  );

  item.set('boolean', 1);
  test.isTrue(item.boolean,
    'The "boolean" field\'s value after setting to 1 should become true'
  );

  item.set('date', (new Date(2000, 0, 1, 0, 0, 0)).getTime());
  test.equal(item.date, new Date(2000, 0, 1, 0, 0, 0),
    'The "date" field\'s value after setting to "" should become false'
  );

  item.set('array', 123);
  test.equal(item.array, [],
    'The "array" field\'s value after setting to 123 should become []'
  );

  ///////////////////////////////////////////////


  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
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

  var item = new Item();
  item.set('string', 123);
  item.set('number', '123');
  item.set('boolean', 1);
  item.set('date', 946681200000);
  item.set('object', 123);
  item.set('array', 123);

  test.equal(item.string, '123',
    'The "string" field\'s value should be casted to string'
  );
  test.equal(item.number, 123,
    'The "number" field\'s value should be casted to number'
  );
  test.equal(item.boolean, true,
    'The "boolean" field\'s value should be casted to boolean'
  );
  test.equal(item.date, new Date(2000, 0, 1),
    'The "date" field\'s value should be casted to date'
  );
  test.instanceOf(item.object, Number,
    'The "object" field\'s value should be casted to object'
  );
  test.equal(item.array, [],
    'The "array" field\'s value should be casted to array'
  );
});
