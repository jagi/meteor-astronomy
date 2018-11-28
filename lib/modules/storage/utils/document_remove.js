import triggerBeforeRemove from './trigger_before_remove.js';
import triggerAfterRemove from './trigger_after_remove.js';

function documentRemove(args = {}) {
  const {
    doc,
    simulation = true,
    trusted = false
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  const Class = doc.constructor;
  const Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew) {
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('remove') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Removing from the client is not allowed');
  }

  // Trigger before events.
  triggerBeforeRemove(args);

  // Remove a document.
  try {
    const result = Collection._collection.remove({
      _id: doc._id
    });

    // Mark a document as new, so it will be possible to save it again.
    doc._isNew = true;

    // Trigger after events.
    triggerAfterRemove(args);

    return result;
  }
  catch(err) {
    if (err.name === 'MongoError' || err.name === 'MinimongoError') {
      throw new Meteor.Error(409, err.toString());
    }
    else {
      throw err;
    }
  }
};

export default documentRemove;