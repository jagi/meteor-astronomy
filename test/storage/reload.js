Tinytest.add('Storage - Reload', function(test) {
  reset();

  let storage = new Storage({
    string: 'abc',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    anything: {
      string: 'abc'
    },
    nested: {
      string: 'abc'
    }
  });
  storage.save();

  // Modify document.
  storage.string = 'cba';
  storage.number = 321;
  storage.boolean = false;
  storage.date = new Date(2001, 0, 1, 0, 0, 0, 0);
  storage.array = [3, 2, 1];
  storage.anything = {
    string: 'cba'
  };
  storage.nested = {
    string: 'cba'
  };
  storage.reload();

  test.isTrue(EJSON.equals(storage, Storage.findOne()),
    'Document should be reloaded to the original state'
  );
});
