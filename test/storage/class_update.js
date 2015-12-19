Tinytest.add('Storage - Class update', function(test) {
  let id = 'ekfAFb8w5umxaeAPs';

  Storage.update(id, {
    $set: {
      'one': {
        'string': 'abc',
        'transient': 'transient'
      },
      'numbers': [1, 2, 3],
      'anything': {
        'string': 'abc',
      },
      'string': 'abc',
      'number': 123,
      'boolean': true,
      'date': new Date(2000, 0, 1)
    },
    $push: {
      'many': {
        'string': 'abc',
        'transient': 'transient'
      }
    }
  });

  let expected = {
    '_id': id,
    'one': {
      'string': 'abc'
    },
    'many': [{
      'string': 'abc'
    }],
    'numbers': [1, 2, 3],
    'anything': {
      'string': 'abc'
    },
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1)
  };

  test.equal(Storages.findOne(id), expected,
    'Document has not been updated properly'
  );
});
