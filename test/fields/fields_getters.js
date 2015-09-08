Tinytest.add('Fields - Getters', function(test) {
  // Reset Astronomy.
  reset();

  // Class for usage as a nested field.
  var NestedGetter = Astro.Class({
    name: 'NestedGetter',
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
        default: new Date(2000, 0, 1)
      }
    }
  });

  // Define simple class to work with.
  var Getter = Astro.Class({
    name: 'Getter',
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedGetter',
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
        default: new Date(2000, 0, 1)
      }
    }
  });

  var getter = new Getter({
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

  test.equal(getter.get('string'), 'string',
    'Calling "getter.get(\'string\')" should return "string"'
  );

  test.equal(getter.get('number'), 123,
    'Calling "getter.get(\'number\')" should return 123'
  );

  test.equal(getter.get('boolean'), true,
    'Calling "getter.get(\'boolean\')" should return true'
  );

  test.equal(getter.get('date'), new Date(2000, 0, 1, 0, 0, 0, 0),
    'Calling "getter.get(\'date\')" should return Date(2000, 0, 1, 0, 0, 0, 0)'
  );

  test.equal(getter.get('array'), [1, 2, 3],
    'Calling "getter.get(\'array\')" should return [1, 2, 3]'
  );

  test.equal(getter.get('object'), {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'Calling "getter.get(\'object\')" should return {a: "a", b: "b", c: "c"}'
  );

  test.equal(getter.get('object.a'), 'a',
    'The value of the "object.a" field should be equal "a"'
  );

  test.equal(getter.get('nested.string'), 'string',
    'The value of the "nested.string" field should be equal "string"'
  );
});
