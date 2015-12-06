Tinytest.add('Storage - Direct update', function(test) {
  // Get the "_id" property of the inserted document.
  var id = Storages.findOne({}, {
    transform: null
  })._id;

  Storage.update(id, {
    $set: {
      string: 'cba',
      number: '321',
      boolean: false
    },
    $push: {
      array: 'abc'
    }
  });

  var expected = {
    _id: id,
    nested: null,
    object: {},
    array: ['abc'],
    string: 'cba',
    number: 321,
    boolean: false,
    date: null
  };
  var storage = Storages.findOne(id, {
    transform: null
  });
  test.equal(storage, expected,
    'A document has not been updated properly'
  );
});
