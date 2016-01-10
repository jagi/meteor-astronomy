Tinytest.add('Fields - Modified', function(test) {
  reset();

  var ModifiedCollection = new Mongo.Collection(null);

  // Define simple class to work with.
  var Modified = Astro.Class.create({
    name: 'Modified',
    collection: ModifiedCollection,
    fields: {
      'string': {
        type: String,
        default: 'string'
      },
      'number': {
        type: Number,
        default: 123
      },
      'boolean': {
        type: Boolean,
        default: true
      }
    }
  });

  var modified = new Modified();

  test.equal(_.keys(modified.getModified()), [],
    'A new document should not have modified fields'
  );

  modified.save();
  modified.set({
    'string': 'abc',
    'number': 321,
    'boolean': false
  });
  var modifierFields = [
    'string', 'number', 'boolean'
  ];
  test.equal(_.keys(modified.getModified()), modifierFields,
    'Only changed fields of a document should be modified'
  );
});
