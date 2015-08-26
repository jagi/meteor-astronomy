Tinytest.add('Storage - Insert', function(test) {
  var storage = new Storage();

  storage.set('string', 'string');
  storage.set('number', 123);
  storage.set('boolean', true);
  storage.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  storage.set('array', [1, 2, 3]);
  storage.set('object', {
    a: 'a',
    b: 'b',
    c: 'c'
  });
  storage.set('nested', new NestedCore({
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
  }));
  storage.save();

  storage = _.omit(Storages.findOne({}, {
    transform: null
  }), '_id');

  expectedCore = {
    string: 'string',
    number: 123,
    boolean: true,
    date: new Date(2000, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3],
    object: {
      a: 'a',
      b: 'b',
      c: 'c'
    },
    nested: {
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
    }
  };

  test.equal(storage, expectedCore,
    'The document has not been saved properly'
  );
});
