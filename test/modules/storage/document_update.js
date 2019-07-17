import { Class } from 'meteor/jagi:astronomy';
import { MongoInternals } from 'meteor/mongo';
import { Promise } from 'meteor/promise';

Tinytest.add('Modules - Storage - Document update', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  const storage = Storage.findOne(id);

  // Update a document.
  storage.one.string = 'cba'
  storage.one.transient = 'transient'
  storage.one.immutable = 'IMMUTABLE'
  storage.many[0].string = 'cba';
  storage.many[0].transient = 'transient';
  storage.many[0].immutable = 'IMMUTABLE';
  storage.numbers = [3, 2, 1];
  storage.string = 'cba';
  storage.number = 321;
  storage.boolean = false;
  storage.date = new Date(2001, 0, 1, 0, 0, 0, 0);
  storage.transient = 'transient';
  storage.immutable = 'IMMUTABLE';
  storage.save();

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
    'date': new Date(2001, 0, 1, 0, 0, 0, 0),
    'immutable': 'immutable',
  };
  test.equal(Storage.findOne(id, {
    transform: null,
  }), expected,
    'The document has not been updated properly'
  );
});

if (Meteor.isServer) {
  Tinytest.add('Modules - Storage - Document update with Mongo Transactions', function(test) {
    const Storage = Class.get('PersistentStorage');
    const expected = 'Initial string';
    const id = Storage.insert({string: expected, immutable: 'dummy'})
    const storage = Storage.findOne(id);

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      storage.string = 'Changed string'
      storage.save({session})
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(id).string, 'Changed string', 'The document has not been updated')
  });

  Tinytest.add('Modules - Storage - Document update with Mongo Transactions (Rollback)', function(test) {
    const Storage = Class.get('PersistentStorage');
    const expected = 'Initial string';
    const id = Storage.insert({string: expected, immutable: 'dummy'})
    const storage = Storage.findOne(id);

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      storage.string = 'Changed string'
      storage.save({session})
      throw new Meteor.Error(500, 'Throw error for testing purpose')
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(id).string, 'Initial string', 'The document has been updated')
  });

}
