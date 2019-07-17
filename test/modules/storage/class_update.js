import { Class } from 'meteor/jagi:astronomy';
import { MongoInternals } from 'meteor/mongo';
import { Promise } from 'meteor/promise';

Tinytest.add('Modules - Storage - Class update', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  Storage.update(id, {
    $set: {
      'one': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE',
      },
      'many.0': {
        'string': 'cba',
        'transient': 'transient',
        'immutable': 'IMMUTABLE',
      },
      'numbers': [3, 2, 1],
      'string': 'cba',
      'number': 321,
      'boolean': false,
      'date': new Date(2001, 0, 1),
      'immutable': 'IMMUTABLE',
    }
  });

  const expected = {
    '_id': id,
    'one': {
      'string': 'cba',
      'immutable': 'immutable',
    },
    'many': [{
      'string': 'cba',
      'immutable': 'immutable',
    }],
    'numbers': [3, 2, 1],
    'string': 'cba',
    'number': 321,
    'boolean': false,
    'date': new Date(2001, 0, 1),
    'immutable': 'immutable',
  };
  test.equal(Storage.findOne(id, {
    transform: null
  }), expected,
    'Document has not been updated properly'
  );
});

if (Meteor.isServer) {
  Tinytest.add('Modules - Storage - Class update with Mongo Transactions', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const initial = {
      _id,
      string: 'Some String'
    }
    const expected = {
      _id,
      string: 'Changed String'
    }
    Storage.insert(initial)

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      Storage.update({_id}, {
        $set: {
          string: 'Changed String'
        }
      }, {session})
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(_id, {
      transform: null
    }), expected,
      'Document has not been updated properly'
    );
  });

  Tinytest.add('Modules - Storage - Class update with Mongo Transactions (Rollback)', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const initial = {
      _id,
      string: 'Some String'
    }
    const expected = {
      _id,
      string: 'Changed String'
    }
    Storage.insert(initial)

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      Storage.update({_id}, {
        $set: {
          string: 'Changed String'
        }
      }, {session})
      throw new Meteor.Error(500, 'Throw error for testing purpose')
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(_id, {
      transform: null
    }), initial,
      'Document does not have to be updated'
    );
  });

}
