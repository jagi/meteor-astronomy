reset = function() {
  Astro.classes = {};
};

Tinytest.add('Core - Init', function(test) {
  // Reset Astronomy.
  reset();

  // Create collection.
  Cores = new Mongo.Collection(null);

  // Remove all previously stored documents.
  Cores.find({}, {
    transform: null
  }).forEach(function(item) {
    Cores.remove(item._id);
  });

  // Class for usage as a nested field.
  NestedCore = Astro.Class({
    name: 'NestedCore',
    embedOne: {
      'object': {}
    },
    embedMany: {
      'array': {}
    },
    fields: {
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
  Core = Astro.Class({
    name: 'Core',
    collection: Cores,
    embedOne: {
      'nested': {
        class: 'NestedCore'
      },
      'object': {}
    },
    embedMany: {
      'array': {}
    },
    fields: {
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
});
