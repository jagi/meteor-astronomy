Tinytest.add('Core - Insert', function(test) {
  var core = new Core();

  core.set('string', 'string');
  core.set('number', 123);
  core.set('boolean', true);
  core.set('date', new Date(2000, 0, 1, 0, 0, 0, 0));
  core.set('array', [1, 2, 3]);
  core.set('object', {
    a: 'a',
    b: 'b',
    c: 'c'
  });
  core.set('nested', new NestedCore({
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
  core.save();

  core = _.omit(Cores.findOne({}, {
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

  test.equal(core, expectedCore,
    'The document has not been saved properly'
  );
});
