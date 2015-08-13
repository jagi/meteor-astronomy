Tinytest.add('Core - Update', function(test) {
  var core = Cores.findOne();

  core.set('string', core.get('string').toUpperCase());
  core.set('number', 321);
  core.set('boolean', false);
  core.set('date', new Date(2001, 0, 1, 0, 0, 0, 0));
  core.array.push(4);
  core.object.d = 'd';
  core.save();

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

  core = _.omit(Cores.findOne({}, {
    transform: null
  }), '_id');

  test.equal(core, expectedCore,
    'The document has not been updated properly'
  );
});
