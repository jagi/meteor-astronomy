Tinytest.add('Fields - Transient', function(test) {
  var TransientCollection = new Mongo.Collection(null);
  removeAll(TransientCollection);

  var NestedTransient = Astro.Class({
    name: 'NestedTransient',
    fields: {
      string: {
        type: 'string',
        default: 'abc'
      },
      transient: {
        type: 'string',
        transient: true,
        default: 'abc'
      }
    }
  });

  var Transient = Astro.Class({
    name: 'Transient',
    collection: TransientCollection,
    fields: {
      string: {
        type: 'string',
        default: 'abc'
      },
      transient: {
        type: 'string',
        transient: true,
        default: 'abc'
      },
      object: {
        type: 'object',
        nested: 'NestedTransient',
        default: function() {
          return {};
        }
      }
    }
  });

  var transient = new Transient();
  transient.save();

  var expected = {
    string: 'abc',
    object: {
      string: 'abc'
    }
  };
  var transientPlain = _.omit(TransientCollection.findOne({}, {
    transform: null
  }), '_id');

  test.equal(transientPlain, expected,
    'Transient fields should not be saved'
  );
});
