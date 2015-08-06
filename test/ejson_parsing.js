Tinytest.add('EJSON - Parsing', function(test) {
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
      'object': {
        type: 'Object'
      },
      'array': {
        type: 'Array'
      },
      'date': {
        type: 'Date'
      }
    }
  });

  var itemA = new Item({
    string: 'string',
    number: 123,
    boolean: true,
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    array: [
      1,
      2,
      3
    ],
    date: new Date(2000, 0, 1, 0, 0, 0)
  });

  var string = EJSON.stringify(itemA);
  var itemB = EJSON.parse(string);

  test.equal(typeof itemB.string, 'string',
    'The "string" field\'s value should be a string'
  );
  test.equal(typeof itemB.number, 'number',
    'The "number" field\'s value should be a number'
  );
  test.equal(typeof itemB.boolean, 'boolean',
    'The "boolean" field\'s value should be a boolean'
  );
  test.instanceOf(itemB.object, Object,
    'The "object" field\'s value should be an object'
  );
  test.instanceOf(itemB.array, Array,
    'The "array" field\'s value should be an array'
  );
  test.instanceOf(itemB.date, Date,
    'The "date" field\'s value should be a date'
  );

  test.equal(itemA.string, itemB.string,
    'The "string" field\'s value should not change'
  );
  test.equal(itemA.number, itemB.number,
    'The "number" field\'s value should not change'
  );
  test.equal(itemA.boolean, itemB.boolean,
    'The "boolean" field\'s value should not change'
  );
  test.equal(itemA.object, itemB.object,
    'The "object" field\'s value should not change'
  );
  test.equal(itemA.array, itemB.array,
    'The "array" field\'s value should not change'
  );
  test.equal(itemA.date, itemB.date,
    'The "date" field\'s value should not change'
  );
});
