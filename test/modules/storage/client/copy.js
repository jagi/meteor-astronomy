Tinytest.add('Storage - Copy', function(test) {
	resetDatabase();

	let id = '6tMS79Kx6WhqTEwaC';
  let storage = new Storage({
		_id: id,
    one: {
      string: 'abc',
      immutable: 'immutable'
    },
    many: [{
      string: 'abc',
      immutable: 'immutable'
    }],
    numbers: [1, 2, 3],
    string: 'abc',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0),
    immutable: 'immutable'
  });
  storage.save();

  let clone = storage.copy();
  test.isNull(clone._id,
    'In the cloned document a value of the "_id" field should be null'
  );

  clone = storage.copy(true);
  test.isNotNull(clone._id,
    'In the saved cloned document a value of the "_id" field should not be null'
  );
  test.notEqual(clone._id, storage._id,
    'The "_id" fields of the original and cloned documents should not be equal'
  );
  test.equal(_.omit(clone.raw(), '_id'), _.omit(storage.raw(), '_id'),
    'All values (except the "_id" field) of the original and cloned ' +
    'documents should be equal'
  );
});
