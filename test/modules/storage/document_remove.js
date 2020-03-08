import { Class } from 'meteor/jagi:astronomy';
import { MongoInternals } from 'meteor/mongo';
import { Promise } from 'meteor/promise';

Tinytest.add('Modules - Storage - Document remove', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  const storage = Storage.findOne(id);
  storage.remove();

  test.equal(Storage.find(id).count(), 0,
    'The document has not been removed properly'
  );
});

if (Meteor.isServer) {
  Tinytest.add('Modules - Storage - Document remove with Mongo Transactions', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const expected = {
      string: 'Some String'
    }
    const storage = new Storage(expected);
    const _id = storage.save()

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      storage.remove({session})
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(_id), undefined, 'The document should be removed')
  });

  Tinytest.add('Modules - Storage - Document remove with Mongo Transactions (Rollback)', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const expected = {
      _id,
      string: 'Some String'
    }
    const storage = new Storage(expected);
    storage.save()

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      storage.remove({session})
      throw new Meteor.Error(500, 'Throw error for testing purpose')
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(_id, {
        transform: null,
      }), expected,
      'Document does not have to be removed'
    );
  });

}
