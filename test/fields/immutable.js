Tinytest.add('Fields - Immutable', function(test) {
  reset();

  let ImmutableNested = Astro.Class.create({
    name: 'ImmutableNested',
    fields: {
      'string': {
        type: 'string'
      },
      'immutable': {
        type: 'string',
        immutable: true
      }
    }
  });

  let ImmutableCollection = new Mongo.Collection(null);

  let Immutable = Astro.Class.create({
    name: 'Immutable',
    collection: ImmutableCollection,
    nested: {
      'one': {
        count: 'one',
        class: 'ImmutableNested',
        default: function() {
          return {};
        }
      }
    },
    fields: {
      'string': {
        type: 'string'
      },
      'immutable': {
        type: 'string',
        immutable: true
      }
    }
  });

  let id = 'ekfAFb8w5umxaeAPs';
  let doc = new Immutable({
    '_id': id,
    'string': 'abc',
    'immutable': 'abc',
    'one': new ImmutableNested({
      'string': 'abc',
      'immutable': 'abc'
    })
  });
  doc.save();

  test.equal(ImmutableCollection.findOne(id), {
    '_id': id,
    'string': 'abc',
    'immutable': 'abc',
    'one': {
      'string': 'abc',
      'immutable': 'abc'
    }
  },
    'Changes to immutable fields should be saved'
  );

  doc.string = 'cba';
  doc.immutable = 'cba';
  doc.one.string = 'cba';
  doc.one.immutable = 'cba';
  doc.save();

  test.equal(ImmutableCollection.findOne(id), {
    '_id': id,
    'string': 'cba',
    'immutable': 'abc',
    'one': {
      'string': 'cba',
      'immutable': 'abc'
    }
  },
    'Changes to immutable fields should not be saved'
  );
});
