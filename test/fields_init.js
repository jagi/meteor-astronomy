Tinytest.add('Fields - Init', function(test) {
  Fields = new Mongo.Collection(null);

  // Class for usage as a nested field.
  NestedField = Astro.Class({
    name: 'NestedField',
    embedOne: {
      'object': {
        default: null
      }
    },
    embedMany: {
      'array': {}
    },
    fields: {
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
  Field = Astro.Class({
    name: 'Field',
    collection: Fields,
    embedOne: {
      'nested': {
        class: 'NestedField',
        default: {}
      },
      'object': {}
    },
    embedMany: {
      'array': {}
    },
    fields: {
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
});
