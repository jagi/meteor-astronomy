Tinytest.add('Storage - Direct upsert', function(test) {
  // Get the "_id" property of the inserted document.
  var id = Storages.findOne({}, {
    transform: null
  })._id;

  Storage.upsert(id, {
    $set: {
      string: 'abc',
      number: '123',
      boolean: true
    },
    $push: {
      array: 'cba'
    }
  });

  var expected = {
    '_id': id,
    'nested': null,
    'object': {},
    'array': ['abc', 'cba'],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': null
  };
  var updateStorage = Storages.findOne(id, {
    transform: null
  });
  test.equal(updateStorage, expected,
    'A document has not been updated properly'
  );

  var customId = 'CuStOmId';
  Storage.upsert(customId, {
    $set: {
      string: 'abc',
      number: '123',
      boolean: true
    },
    $push: {
      array: 'cba'
    }
  });

  var expected = {
    '_id': customId,
    'nested': null,
    'object': {},
    'array': ['cba'],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': null
  };
  var insertStorage = Storages.findOne(customId, {
    transform: null
  });
  test.equal(insertStorage, expected,
    'A document has not been inserted properly'
  );
});
