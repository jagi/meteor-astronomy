Tinytest.add('Storage - Init', function(test) {
  reset();

  Storages = new Mongo.Collection(null);

  NestedStorage = Astro.Class.create({
    name: 'NestedStorage',
    fields: {
      'string': 'string'
    }
  });

  Storage = Astro.Class.create({
    name: 'Storage',
    collection: Storages,
    nested: {
      'one': {
        count: 'one',
        class: 'NestedStorage',
        default: null
      },
      'many': {
        count: 'many',
        class: 'NestedStorage'
      },
      'numbers': {
        count: 'many',
        type: 'number'
      }
    },
    fields: {
      'anything': null,
      'string': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'date': 'date'
    }
  });
});