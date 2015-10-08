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
        default: function() {
          return new Date(2000, 0, 1);
        }
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
        default: function() {
          return new Date(2000, 0, 1);
        }
      }
    }
  });

  var setter = new Setter();

  setter.set('string', 'string');
  test.equal(setter.string, 'string',
    'The set value of the "string" field is not correct'
  );

  setter.set('number', 123);
  test.equal(setter.number, 123,
    'The set value of the "number" field is not correct'
  );

  setter.set('boolean', true);
  test.equal(setter.boolean, true,
    'The set value of the "boolean" field is not correct'
  );

  setter.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  test.equal(setter.date, new Date(2000, 0, 1, 0, 0, 0, 0),
    'The set value of the "date" field is not correct'
  );

  setter.set('array', [1, 2]);
  test.equal(setter.array, [1, 2],
    'The set value of the "array" field is not correct'
  );

  setter.set('object', {
    a: 'a',
    b: 'b'
  });
  test.equal(setter.object, {
    a: 'a',
    b: 'b'
  },
    'The set value of the "object" field is not correct'
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
    'The set value of the "string" field is not correct'
  );
  test.equal(setter.number, 321,
    'The set value of the "number" field is not correct'
  );
  test.equal(setter.boolean, false,
    'The set value of the "boolean" field is not correct'
  );
  test.equal(setter.date, new Date(2001, 0, 1, 0, 0, 0, 0),
    'The set value of the "date" field is not correct'
  );
  test.equal(setter.array, [1, 2, 3],
    'The set value of the "array" field is not correct'
  );
  test.equal(setter.object, {
    a: 'a',
    b: 'b',
    c: 'c'
  },
    'The set value of the "object" field is not correct'
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
    'The set value of the "string" field is not correct'
  );
  test.equal(setter.number, 111,
    'The set value of the "number" field is not correct'
  );
  test.equal(setter.boolean, true,
    'The set value of the "boolean" field is not correct'
  );
  test.equal(setter.date, new Date(2002, 0, 1, 0, 0, 0, 0),
    'The set value of the "date" field is not correct'
  );
  test.equal(setter.array, [1],
    'The set value of the "array" field is not correct'
  );
  test.equal(setter.object, {
    a: 'a'
  },
    'The set value of the "object" field is not correct'
  );

  setter.set('object.a', 1);
  test.equal(setter.object.a, 1,
    'The set value of the "object.a" field is not correct'
  );

  setter.set('nested.string', 'string');
  test.equal(setter.nested.string, 'string',
    'The set value of the "nested.string" field is not correct'
  );
});
