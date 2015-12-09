Tinytest.add('Storage - Class update', function(test) {
  let id = Storages.findOne()._id;

  Storage.update(id, {
    $set: {
      'one': {},
      'numbers': [1, 2, 3],
      'anything': {
        'string': 'abc'
      },
      'string': 'abc',
      'number': 123,
      'boolean': true,
      'date': new Date(2000, 0, 1)
    },
    $push: {
      'many': {}
    }
  });

  let expected = {
    '_id': id,
    'one': {
      'string': null
    },
    'many': [{
      'string': null
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
