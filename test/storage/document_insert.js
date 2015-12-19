Tinytest.add('Storage - Document insert', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';
  let storage = new Storage({
    '_id': id,
    'one': {
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable'
    },
    'many': [{
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable'
    }],
    'numbers': [1, 2, 3],
    'anything': {
      'string': 'abc'
    },
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'transient': 'transient',
    'immutable': 'immutable'
  });
  storage.save();

  let expected = {
    '_id': id,
    'one': {
      'string': 'abc',
      'immutable': 'immutable'
    },
    'many': [{
      'string': 'abc',
      'immutable': 'immutable'
    }],
    'numbers': [1, 2, 3],
    'anything': {
      'string': 'abc',
    },
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'immutable': 'immutable'
  };
  test.equal(Storages.findOne(id), expected,
    'Document has not been saved properly'
  );
});
