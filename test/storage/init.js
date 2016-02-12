Tinytest.add('Storage - Init (Client)', function(test) {
  reset();

  Storages = new Mongo.Collection('storages_client');

  NestedStorage = Astro.Class.create({
    name: 'NestedStorage',
    fields: {
      string: {
        type: String,
        optional: true
      },
      transient: {
        type: String,
        transient: true
      },
      immutable: {
        type: String,
        immutable: true
      }
    }
  });

  Storage = Astro.Class.create({
    name: 'Storage',
    collection: Storages,
    fields: {
      one: {
        type: NestedStorage,
        optional: true
      },
      many: {
        type: [NestedStorage],
        optional: true
      },
      numbers: {
        type: [Number],
        optional: true
      },
      string: {
        type: String,
        optional: true
      },
      number: {
        type: Number,
        optional: true
      },
      boolean: {
        type: Boolean,
        optional: true
      },
      date: {
        type: Date,
        optional: true
      },
      transient: {
        type: String,
        transient: true
      },
      immutable: {
        type: String,
        immutable: true
      }
    }
  });
});