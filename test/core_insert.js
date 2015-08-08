Tinytest.add('Core - Insert', function(test) {
  var item = new SimpleItem();

  item.set('string', 'string');
  item.set('number', 123);
  item.set('boolean', true);
  item.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  item.set('array', [1, 2, 3]);
  item.set('object', {
    a: 'a',
    b: 'b',
    c: 'c'
  });
  item.set('nested', new Nested({
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
  item.save();

  item = _.omit(Items.findOne({}, {
    transform: null
  }), '_id');

  testItem = {
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

  test.equal(item, testItem,
    'The document has not been saved properly'
  );
});
