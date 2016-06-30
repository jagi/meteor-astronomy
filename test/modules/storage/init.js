import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Init', function(test) {
  reset();

  const NestedStorage = Class.create({
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

  const Storages = new Mongo.Collection(null);

  const Storage = Class.create({
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