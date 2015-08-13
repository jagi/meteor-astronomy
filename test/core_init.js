Tinytest.add('Core - Init', function(test) {
  // Remove all classes.
  Astro.classes = [];

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
      'string': {
        type: 'String'
      },
      'number': {
        type: 'Number'
      },
      'boolean': {
        type: 'Boolean'
      },
      'date': {
        type: 'Date'
      },
      'object': {
        type: 'Object'
      },
      'array': {
        type: 'Array'
      }
    }
  });

  // Define simple class to work with.
  Core = Astro.Class({
    name: 'Core',
    collection: Cores,
    fields: {
      'string': {
        type: 'String'
      },
      'number': {
        type: 'Number'
      },
      'boolean': {
        type: 'Boolean'
      },
      'date': {
        type: 'Date'
      },
      'object': {
        type: 'Object'
      },
      'array': {
        type: 'Array'
      },
      'nested': {
        type: 'NestedCore'
      }
    }
  });
});
