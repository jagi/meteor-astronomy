Tinytest.add('Storage - Class insert', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';
  Storage.insert({
    '_id': id,
    'transient': 'transient'
  });

  let expected = {
    '_id': id,
    'one': null,
    'many': null,
    'numbers': null,
    'anything': null,
    'string': null,
    'number': null,
    'boolean': null,
    'date': null
  };

  test.equal(Storages.findOne(id), expected,
    'Document has not been inserted properly'
  );
});
