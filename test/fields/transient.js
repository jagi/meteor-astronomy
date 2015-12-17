Tinytest.add('Fields - Transient', function(test) {
  reset();

  let TransientNested = Astro.Class.create({
    name: 'TransientNested',
    fields: {
      'string': {
        type: 'string',
        default: 'abc'
      },
      'transient': {
        type: 'string',
        transient: true,
        default: 'abc'
      }
    }
  });

  let TransientCollection = new Mongo.Collection(null);

  let Transient = Astro.Class.create({
    name: 'Transient',
    collection: TransientCollection,
    nested: {
      'one': {
        count: 'one',
        class: 'TransientNested',
        default: function() {
          return {};
        }
      }
    },
    fields: {
      'string': {
        type: 'string',
        default: 'abc'
      },
      'transient': {
        type: 'string',
        transient: true,
        default: 'abc'
      }
    }
  });

  let id = 'ekfAFb8w5umxaeAPs';
  let transient = new Transient({_id: id});
  transient.save();

  let expected = {
    '_id': id,
    'string': 'abc',
    'one': {
      'string': 'abc'
    }
  };
  test.equal(TransientCollection.findOne(id), expected,
    'Transient fields should not be saved'
  );
});
