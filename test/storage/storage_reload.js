Tinytest.add('Storage - Reload', function(test) {
  var storage = new Storage();

  storage.set({
    'string': 'string',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'array': [1, 2, 3],
    'object': {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    'nested': new NestedCore({
      string: 'string',
      number: 123,
      boolean: true,
      date: new Date(2000, 0, 1, 0, 0, 0, 0),
      array: [1, 2, 3],
      object: {
        a: 'a',
        b: 'b',
        c: 'c'
      }
    })
  });
  storage.save();

  storage.set({
    'string': 'abc',
    'number': 321,
    'boolean': false
  });
  storage.reload();

  var expected = {
    'string': 'string',
    'number': 123,
    'boolean': true
  };
  test.equal(storage.get(['string', 'number', 'boolean']), expected,
    'Fields values should get back to the previous state'
  );
});
