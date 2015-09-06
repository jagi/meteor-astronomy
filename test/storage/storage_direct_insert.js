Tinytest.add('Storage - Direct insert', function(test) {
  // Remove all previously stored documents.
  removeAll(Storages);

  Storage.insert({});

  storage = _.omit(Storages.findOne({}, {
    transform: null
  }), '_id');

  var expected = {
    'nested': null,
    'object': {},
    'array': [],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': null,
  };
  test.equal(storage, expected,
    'A document has not been inserted properly'
  );
});
