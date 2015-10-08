Tinytest.add('Fields - Raw', function(test) {
  // Reset Astronomy.
  reset();

  // Class for usage as a nested field.
  var NestedRaw = Astro.Class({
    name: 'NestedRaw',
    fields: {
      'object': {
        type: 'object',
        default: function() {
          return {};
        }
      },
      'array': {
        type: 'array',
        default: function() {
          return [];
        }
      },
      'null': {
        type: null
      },
      'string': {
        type: 'string',
        default: 'string'
      },
      'number': {
        type: 'number',
        default: 123
      },
      'boolean': {
        type: 'boolean',
        default: true
      },
      'date': {
        type: 'date',
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  // Define simple class to work with.
  var Raw = Astro.Class({
    name: 'Raw',
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedRaw',
        default: function() {
          return {};
        }
      },
      'object': {
        type: 'object',
        default: function() {
          return {};
        }
      },
      'array': {
        type: 'array',
        default: function() {
          return [];
        }
      },
      'null': {
        type: null,
        default: null
      },
      'string': {
        type: 'string',
        default: 'string'
      },
      'number': {
        type: 'number',
        default: 123
      },
      'boolean': {
        type: 'boolean',
        default: true
      },
      'date': {
        type: 'date',
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  var rawDoc = new Raw({
    string: 'string',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    nested: {
      string: 'string'
    }
  });

  test.equal(rawDoc.raw('string'), 'string',
    'The raw value of the "string" field is not correct'
  );

  test.equal(rawDoc.raw('number'), 123,
    'The raw value of the "number" field is not correct'
  );

  test.equal(rawDoc.raw('boolean'), true,
    'The raw value of the "boolean" field is not correct'
  );

  test.equal(rawDoc.raw('date'), new Date(2000, 0, 1, 0, 0, 0, 0),
    'The raw value of the "date" field is not correct'
  );

  test.equal(rawDoc.raw('array'), [1, 2, 3],
    'The raw value of the "array" field is not correct'
  );

  test.equal(rawDoc.raw('object'), {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The raw value of the "object" field is not correct'
  );

  var rawNested = {
    object: {},
    array: [],
    null: null,
    string: 'string',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0)
  };
  test.equal(rawDoc.raw('nested'), rawNested,
    'The raw value of the "nested" field is not correct'
  );

  test.equal(rawDoc.raw('object.a'), 'a',
    'The raw value of the "object.a" field is not correct'
  );

  test.equal(rawDoc.raw('nested.string'), 'string',
    'The raw value of the "nested.string" field is not correct'
  );
});
