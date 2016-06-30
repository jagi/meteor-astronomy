import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Document insert', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  const storage = new Storage({
    '_id': id,
    'one': {
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'abc',
      'transient': 'transient',
      'immutable': 'immutable',
    }],
    'numbers': [1, 2, 3],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'transient': 'transient',
    'immutable': 'immutable',
  });
  const returnedId = storage.save();

  const expected = {
    '_id': id,
    'one': {
      'string': 'abc',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'abc',
      'immutable': 'immutable',
    }],
    'numbers': [1, 2, 3],
    'string': 'abc',
    'number': 123,
    'boolean': true,
    'date': new Date(2000, 0, 1, 0, 0, 0, 0),
    'immutable': 'immutable',
  };
  test.equal(id, returnedId,
    'ID returned from the "save" method is not correct'
  );
  test.equal(Storage.findOne(id, {
      transform: null,
    }), expected,
    'Document has not been saved properly'
  );
});