import { Class } from 'meteor/jagi:astronomy';
import { MongoInternals } from 'meteor/mongo';
import { Promise } from 'meteor/promise';

Tinytest.add('Modules - Storage - Class remove', function(test) {
  const Storage = Class.get('Storage');

  const id = '6tMS79Kx6WhqTEwaC';
  Storage.remove(id);

  test.equal(Storage.find(id).count(), 0,
    'Document has not been removed properly'
  );
});

if (Meteor.isServer) {
  Tinytest.add('Modules - Storage - Class remove with Mongo Transactions', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const expected = {
      _id,
      string: 'Some String'
    }
    Storage.insert(expected);

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      Storage.remove({_id}, {session})
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    test.equal(Storage.findOne(_id), undefined,
      'Document has not been removed properly'
    );
  });

  Tinytest.add('Modules - Storage - Class remove with Mongo Transactions (Rollback)', function(test) {
    const Storage = Class.get('PersistentStorage');
    const Collection = Storage.getCollection()
    const _id = Collection._makeNewID()
    const expected = {
      _id,
      string: 'Some String'
    }
    Storage.insert(expected);

    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo
    session = Promise.await(client.startSession())
    Promise.await(session.startTransaction())
    try {
      Storage.remove({_id}, {session})
      throw new Meteor.Error(500, 'Throw error for testing purpose')
      Promise.await(session.commitTransaction())
    } catch (e) {
      Promise.await(session.abortTransaction())
    } finally {
      Promise.await(session.endSession())
    }
    // console.log(Storage.findOne(_id))
    test.equal(Storage.findOne(_id, {
      transform: null,
    }), expected,
      'Document does not have to be removed'
    );
  });

}
