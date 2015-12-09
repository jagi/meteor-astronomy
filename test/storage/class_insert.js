Tinytest.add('Storage - Class insert', function(test) {
  reset();

  Storage.insert({});

  let storage = _.omit(Storages.findOne(), '_id');
  let expected = {
    'one': null,
    'many': null,
    'numbers': null,
    'anything': null,
    'string': null,
    'number': null,
    'boolean': null,
    'date': null
  };

  test.equal(storage, expected,
    'Document has not been inserted properly'
  );
});
