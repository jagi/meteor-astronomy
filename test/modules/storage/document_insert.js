import { Class } from 'meteor/jagi:astronomy';
import { MongoInternals } from 'meteor/mongo';
import { Promise } from 'meteor/promise';

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

if (Meteor.isServer) {
  Tinytest.add('Modules - Storage - Document insert with Mongo Transactions', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const expected = {
      _id,
      string: 'Some String'
    }
    const storage = new Storage(expected);
    let returnedId;

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      returnedId = storage.save({session})
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(_id, returnedId,
      'ID returned from the "save" method is not correct'
    );
    test.equal(Storage.findOne(_id, {
        transform: null,
      }), expected,
      'Document has not been saved properly'
    );
  });

  Tinytest.add('Modules - Storage - Document insert with Mongo Transactions (Rollback)', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const expected = {
      _id,
      string: 'Some String'
    }
    const storage = new Storage(expected);
    let returnedId;

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      returnedId = storage.save({session})
      throw new Meteor.Error(500, 'Throw error for testing purpose')
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(returnedId), undefined, 'The document does not have to be saved')
  });

}
