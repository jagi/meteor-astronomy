Tinytest.add('Storage - Init', function(test) {
  reset();

  Storages = new Mongo.Collection(null);

  NestedStorage = Astro.Class.create({
    name: 'NestedStorage',
    fields: {
      'string': {
        type: 'string',
        optional: true
      }
    }
  });

  Storage = Astro.Class.create({
    name: 'Storage',
    collection: Storages,
    nested: {
      'one': {
        count: 'one',
        class: 'NestedStorage',
        optional: true
      },
      'many': {
        count: 'many',
        class: 'NestedStorage',
        optional: true
      },
      'numbers': {
        count: 'many',
        type: 'number',
        optional: true
      }
    },
    fields: {
      'anything': {
        type: null,
        optional: true
      },
      'string': {
        type: 'string',
        optional: true
      },
      'number': {
        type: 'number',
        optional: true
      },
      'boolean': {
        type: 'boolean',
        optional: true
      },
      'date': {
        type: 'date',
        optional: true
      }
    }
  });
});