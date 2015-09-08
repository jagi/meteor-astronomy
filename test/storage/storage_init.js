Tinytest.add('Storage - Init', function(test) {
  // Reset Astronomy.
  reset();

  // Create collection.
  Storages = new Mongo.Collection(null);
  // Remove all previously stored documents.
  removeAll(Storages);

  // Class for usage as a nested field.
  NestedStorage = Astro.Class({
    name: 'NestedStorage',
    fields: {
      'object': {
        type: 'object'
      },
      'array': {
        type: 'array'
      },
      'string': {
        type: 'string'
      },
      'number': {
        type: 'number'
      },
      'boolean': {
        type: 'boolean'
      },
      'date': {
        type: 'date'
      }
    }
  });

  // Define simple class to work with.
  Storage = Astro.Class({
    name: 'Storage',
    collection: Storages,
    fields: {
      'nested': {
        type: 'object',
        nested: 'NestedStorage'
      },
      'object': {
        type: 'object',
        default:  function() {
          return {};
        }
      },
      'array': {
        type: 'array',
        default:  function() {
          return [];
        }
      },
      'string': {
        type: 'string',
        default: 'abc'
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
        type: 'date'
      }
    }
  });
});
