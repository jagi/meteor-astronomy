import isEnvironment from '../../../core/utils/is_environment.js';
import triggerBeforeRemove from './trigger_before_remove.js';
import triggerAfterRemove from './trigger_after_remove.js';

function documentRemove(args = {}) {
  let {
    doc,
    environment,
    trusted = false
  } = args;

  // Stop execution if we are not in a given environment.
  if (environment && !isEnvironment(environment)) {
    return;
  }

  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (doc._isNew || !doc._id) {
    return 0;
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