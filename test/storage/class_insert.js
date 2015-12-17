Tinytest.add('Storage - Class insert', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';
  Storage.insert({_id: id});

  let storage = _.omit(Storages.findOne(id), '_id');
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
