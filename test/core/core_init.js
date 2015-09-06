reset = function() {
  Astro.classes = {};
};

removeAll = function(Collection) {
  Collection.find({}, {
    transform: null
  }).forEach(function(doc) {
    Collection.remove(doc._id);
  });
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
  Core = Astro.Class({
    name: 'Core',
    collection: Cores,
    fields: {
      'nested': {
        type: 'object',
        class: 'NestedCore'
      },
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
});
