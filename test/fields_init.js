Tinytest.add('Fields - Init', function(test) {
  Fields = new Mongo.Collection(null);

  // Class for usage as a nested field.
  NestedField = Astro.Class({
    name: 'NestedField',
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

  // Define simple class to work with.
  Field = Astro.Class({
    name: 'Field',
    collection: Fields,
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
      },
      'nested': {
        type: 'NestedField',
        default: {}
      }
    }
  });
});
