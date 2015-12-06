Tinytest.add('Storage - Init', function(test) {
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
      'nested': {
        count: 'one',
        class: 'NestedStorage'
      },
      'array': {
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

  reset();
});