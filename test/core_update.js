Tinytest.add('Core - Update', function(test) {
  var item = Items.findOne();

  item.set('string', item.get('string').toUpperCase());
  item.set('number', 321);
  item.set('boolean', false);
  item.set('date', new Date(2001, 0, 1, 0, 0, 0, 0));
  item.array.push(4);
  item.object.d = 'd';
  item.save();

  var testItem = {
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

  item = _.omit(Items.findOne({}, {
    transform: null
  }), '_id');

  test.equal(item, testItem,
    'The document has not been updated properly'
  );
});
