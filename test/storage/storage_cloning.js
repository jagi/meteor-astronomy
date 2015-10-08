Tinytest.add('Storage - Cloning', function(test) {
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
    'nested': {
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
  });
  storage.save();

  var clone = storage.copy();
  test.isNull(clone.raw('_id'),
    'In the cloned document a value of the "_id" field should be null'
  );

  clone = storage.copy(true);
  test.isNotNull(clone.raw('_id'),
    'In the saved cloned document a value of the "_id" field should not be null'
  );
  test.notEqual(clone.raw('_id'), storage.raw('_id'),
    'The "_id" fields of the original and cloned documents should not be equal'
  );
  test.equal(_.omit(clone.raw(), '_id'), _.omit(storage.raw(), '_id'),
    'All values (excluding the "_id" field) of the original and cloned ' +
    'documents should be equal'
  );
});
