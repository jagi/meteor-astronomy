Tinytest.add('Core - Save', function(test) {
  Astro.classes = [];

  var Item = Astro.Class({
    name: 'Item',
    fields: {
      'null': {
        type: null
      },
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

  test.isNull(item.null, 'null',
    'The "null" field\'s default value should be null'
  );
  test.equal(item.string, 'string',
    'The "string" field\'s default value should be "string"'
  );
  test.equal(item.number, 123,
    'The "number" field\'s default value should be 123'
  );
  test.equal(item.boolean, true,
    'The "boolean" field\'s default value should be null'
  );
  test.equal(item.date, new Date(2000, 0, 1),
    'The "date" field\'s default value should be date "2000-01-01"'
  );
  test.equal(item.object, {},
    'The "object" field\'s default value should be null'
  );
  test.equal(item.array, [],
    'The "array" field\'s default value should be null'
  );
});
