import { Class } from 'meteor/jagi:astronomy';

Tinytest.add('Modules - Storage - Class insert', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  Storage.insert({
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
    'date': new Date(2000, 0, 1),
    'transient': 'transient',
    'immutable': 'immutable',
  });

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
    'date': new Date(2000, 0, 1),
    'immutable': 'immutable',
  };
  test.equal(Storage.findOne(id, {
    transform: null,
  }), expected,
    'Document has not been inserted properly'
  );
});
