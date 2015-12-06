Tinytest.add('Storage - Document update', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';
  let storage = Storage.findOne(id);

  // Update a document.
  storage.nested.string = 'cba'
  storage.array.push(4);
  storage.anything.number = 123;
  storage.string = 'cba';
  storage.number = 321;
  storage.boolean = false;
  storage.date = new Date(2001, 0, 1, 0, 0, 0, 0);
  storage.save();

  let expected = {
    '_id': id,
    'nested': {
      'string': 'cba'
    },
    'array': [1, 2, 3, 4],
    'anything': {
      'string': 'abc',
      'number': 123
    },
    'string': 'cba',
    'number': 321,
    'boolean': false,
    'date': new Date(2001, 0, 1, 0, 0, 0, 0),
  };

  test.equal(Storages.findOne(), expected,
    'The document has not been updated properly'
  );
});
