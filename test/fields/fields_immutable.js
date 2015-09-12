Tinytest.add('Fields - Immutable', function(test) {
  var ImmutableCollection = new Mongo.Collection(null);
  removeAll(ImmutableCollection);

  var NestedImmutable = Astro.Class({
    name: 'NestedImmutable',
    fields: {
      string: {
        type: 'string'
      },
      immutable: {
        type: 'string',
        immutable: true
      }
    }
  });

  var Immutable = Astro.Class({
    name: 'Immutable',
    collection: ImmutableCollection,
    fields: {
      immutable: {
        type: 'string',
        immutable: true
      },
      object: {
        type: 'object',
        nested: 'NestedImmutable',
        default: function() {
          return {};
        },
        immutable: true
      }
    }
  });

  var immutable = new Immutable();
  immutable.save();

  immutable.set('immutable', 'abc');
  test.equal(immutable.immutable, 'abc',
    'It should be possible to change null value of the field'
  );

  immutable.save();
  immutable.set('immutable', 'cba');
  test.equal(immutable.immutable, 'abc',
    'It should not be possible to change non-null value of the field'
  );

  immutable.set('object', {
    string: 'abc'
  });
  test.isNull(immutable.object.string, null,
    'It should not be possible to change object value of the field'
  );

  immutable.set('object.immutable', 'abc');
  test.equal(immutable.object.immutable, 'abc',
    'It should be possible to change null value of the nested field'
  );

  immutable.save();
  immutable.set('immutable', 'cba');
  test.equal(immutable.object.immutable, 'abc',
    'It should not be possible to change non-null value of the nested field'
  );
});
