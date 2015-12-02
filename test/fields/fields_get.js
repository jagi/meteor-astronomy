Tinytest.add('Fields - Get', function(test) {
  // Reset Astro.
  reset();

  // Class for usage as a nested field.
  var NestedGet = Astro.Class({
    name: 'NestedGet',
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
  var Get = Astro.Class({
    name: 'Get',
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedGet',
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

  var getDoc = new Get({
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

  test.equal(getDoc.get('string'), 'string',
    'The value of the "string" field should is not correct'
  );

  test.equal(getDoc.get('number'), 123,
    'The value of the "number" field should is not correct'
  );

  test.equal(getDoc.get('boolean'), true,
    'The value of the "boolean" field should is not correct'
  );

  test.equal(getDoc.get('date'), new Date(2000, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should is not correct'
  );

  test.equal(getDoc.get('array'), [1, 2, 3],
    'The value of the "array" field should is not correct'
  );

  test.equal(getDoc.get('object'), {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The value of the "object" field should is not correct'
  );

  test.instanceOf(getDoc.get('nested'), NestedGet,
    'The value of the "nested" field should be instance of the ' +
    '"NestedGet" class'
  );

  test.equal(getDoc.get('object.a'), 'a',
    'The value of the "object.a" field should is not correct'
  );

  test.equal(getDoc.get('nested.string'), 'string',
    'The value of the "nested.string" field should is not correct'
  );
});
