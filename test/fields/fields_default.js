Tinytest.add('Fields - Default', function(test) {
  // Reset Astronomy.
  reset();

  // Class for usage as a nested field.
  var NestedDefault = Astro.Class({
    name: 'NestedDefault',
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
  var Default = Astro.Class({
    name: 'Default',
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedDefault',
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

  var def = new Default();

  test.isNull(def.null,
    'The default value of the "null" field should be null'
  );
  test.equal(def.string, 'string',
    'The default value of the "string" field should be "string"'
  );
  test.equal(def.number, 123,
    'The default value of the "number" field should be 123'
  );
  test.equal(def.boolean, true,
    'The default value of the "boolean" field should be null'
  );
  test.equal(def.date, new Date(2000, 0, 1),
    'The default value of the "date" field should be Date(2000, 0, 1)'
  );
  test.equal(def.object, {},
    'The default value of the "object" field should be {}'
  );
  test.equal(def.array, [],
    'The default value of the "array" field should be []'
  );
  test.instanceOf(def.nested, NestedDefault,
    'The default value of the "nested" field should be instance of the ' +
    'NestedDefault class'
  );
});
