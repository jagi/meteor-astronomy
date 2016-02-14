Tinytest.add('Storage - Reload', function(test) {
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

  // Modify document.
  storage.one = {
    string: 'cba',
    immutable: 'IMMUTABLE'
  };
  storage.many = [{
    string: 'cba',
    immutable: 'IMMUTABLE'
  }]
  storage.numbers = [3, 2, 1];
  storage.anything = {
    string: 'cba'
  };
  storage.string = 'cba';
  storage.number = 321;
  storage.boolean = false;
  storage.date = new Date(2001, 0, 1, 0, 0, 0, 0);
  storage.immutable = 'IMMUTABLE';
  storage.reload();

  test.isTrue(EJSON.equals(storage, Storage.findOne(id)),
    'Document should be reloaded to the original state'
  );
});
