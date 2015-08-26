Tinytest.add('Storage - Update', function(test) {
  var storage = Storages.findOne();

  storage.set('string', storage.get('string').toUpperCase());
  storage.set('number', 321);
  storage.set('boolean', false);
  storage.set('date', new Date(2001, 0, 1, 0, 0, 0, 0));
  storage.array.push(4);
  storage.object.d = 'd';
  storage.save();

  var expectedCore = {
    string: 'STRING',
    number: 321,
    boolean: false,
    date: new Date(2001, 0, 1, 0, 0, 0, 0),
    array: [1, 2, 3, 4],
    object: {
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd'
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

  storage = _.omit(Storages.findOne({}, {
    transform: null
  }), '_id');

  test.equal(storage, expectedCore,
    'The document has not been updated properly'
  );
});
