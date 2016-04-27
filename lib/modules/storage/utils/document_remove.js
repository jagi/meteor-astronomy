import triggerBeforeRemove from './trigger_before_remove.js';
import triggerAfterRemove from './trigger_after_remove.js';

function documentRemove(args = {}) {
  let {
    doc,
    simulation = true,
    trusted = false
  } = args;

  // Stop execution, if we are not on the server, when the "simulation" flag is
  // not set.
  if (!simulation && !Meteor.isServer) {
    return;
  }

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
  }

  // Check if a class is secured.
  if (Class.isSecured('remove') && Meteor.isServer && !trusted) {
    throw new Meteor.Error(403, 'Removing from the client is not allowed');
  }

  // Trigger before events.
  triggerBeforeRemove(doc, trusted);

  // Remove a document.
  let result = Collection._collection.remove({
    _id: doc._id
  });
  // Set document as a new, so it will be possible to save a document again.
  doc._isNew = true;

  // Trigger after events.
  triggerAfterRemove(doc, trusted);

  return result;
};

export default documentRemove;