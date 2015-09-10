Tinytest.add('Fields - Set', function(test) {
  // Reset Astronomy.
  reset();

  // Class for usage as a nested field.
  var NestedSetter = Astro.Class({
    name: 'NestedSetter',
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
  var Setter = Astro.Class({
    name: 'Setter',
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedSetter',
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

  var setter = new Setter();

  setter.set('string', 'string');
  test.equal(setter.string, 'string',
    'The value of the "string" field should be equal "string"'
  );

  setter.set('number', 123);
  test.equal(setter.number, 123,
    'The value of the "number" field should be equal 123'
  );

  setter.set('boolean', true);
  test.equal(setter.boolean, true,
    'The value of the "boolean" field should be equal true'
  );

  setter.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  test.equal(setter.date, new Date(2000, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2000, 0, 1, 0, 0, 0, 0)'
  );

  setter.set('array', [1, 2]);
  test.equal(setter.array, [1, 2],
    'The value of the "array" field should be equal [1, 2]'
  );

  setter.set('object', {
    a: 'a',
    b: 'b'
  });
  test.equal(setter.object, {
    a: 'a',
    b: 'b'
  },
    'The value of the "object" field should be equal {a: "a", b: "b"}'
  );

  setter = new Setter();
  setter.set({
    string: 'STRING',
    number: 321,
    boolean: false,
    date: new Date(2001, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    }
  });

  test.equal(setter.string, 'STRING',
    'The value of the "string" field should be equal "STRING"'
  );
  test.equal(setter.number, 321,
    'The value of the "number" field should be equal 321'
  );
  test.equal(setter.boolean, false,
    'The value of the "boolean" field should be equal false'
  );
  test.equal(setter.date, new Date(2001, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2001, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(setter.array, [1, 2, 3],
    'The value of the "array" field should be equal [1, 2, 3]'
  );
  test.equal(setter.object, {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The value of the "object" field should be equal {a: "a", b: "b", c: "c"}'
  );

  setter = new Setter({
    string: 'str',
    number: 111,
    boolean: true,
    date: new Date(2002, 0, 1, 0, 0, 0, 0),
    array: [1],
    object: {
      a: 'a'
    }
  });

  test.equal(setter.string, 'str',
    'The value of the "string" field should be equal "str"'
  );
  test.equal(setter.number, 111,
    'The value of the "number" field should be equal 111'
  );
  test.equal(setter.boolean, true,
    'The value of the "boolean" field should be equal true'
  );
  test.equal(setter.date, new Date(2002, 0, 1, 0, 0, 0, 0),
    'The value of the "date" field should be equal Date(2002, 0, 1, 0, 0, 0, 0)'
  );
  test.equal(setter.array, [1],
    'The value of the "array" field should be equal [1]'
  );
  test.equal(setter.object, {
    a: 'a'
  },
    'The value of the "object" field should be equal {a: "a"}'
  );

  setter.set('object.a', 1);
  test.equal(setter.object.a, 1,
    'The value of the "object.a" field should be equal 1'
  );

  setter.set('nested.string', 'string');
  test.equal(setter.nested.string, 'string',
    'The value of the "nested.string" field should be equal "string"'
  );
});
