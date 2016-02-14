Tinytest.add('Storage - Class update', function(test) {
  let id = '6tMS79Kx6WhqTEwaC';
  Storage.update(id, {
    $set: {
      'one': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE'
      },
      'many.0': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE'
      },
      'numbers': [3, 2, 1],
      'string': 'cba',
      'number': 321,
      'boolean': false,
      'date': new Date(2001, 0, 1),
      'immutable': 'IMMUTABLE'
    }
  });

  let expected = {
    '_id': id,
    'one': {
      'string': 'cba',
      'immutable': 'immutable'
    },
    'many': [{
      'string': 'cba',
      'immutable': 'immutable'
    }],
    'numbers': [3, 2, 1],
    'string': 'cba',
    'number': 321,
    'boolean': false,
    'date': new Date(2001, 0, 1),
    'immutable': 'immutable'
  };

  test.equal(Storages.findOne(id), expected,
    'Document has not been updated properly'
  );
});
