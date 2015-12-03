let methods = Astro.Module.modules.storage.meteorMethods;

methods.remove = function(doc) {
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Remove only when document has the "_id" field (it's persisted).
  if (!doc._id) {
    return false;
  }

  // Trigger the "beforeRemove" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error(403, 'Operation prevented');
  }

  // Catch any error that may be caused by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The thrown error can be
  // handled in the `removeMongoError` event.
  try {
    // Remove a document.
    Collection._collection.remove({_id: doc._id});
  } catch (e) {
    if (e.name === 'MongoError') {
      if (!doc.dispatchEvent(new Astro.Event('removeMongoError', {
        error: e
      }))) {
        // If an event was prevented, then we stop here.
        throw new Meteor.Error(403, 'Operation prevented');
      }
    }

    throw e;
  }

  // Clear the "_id" attribute.
  doc._id = null;
  // Set document as a new, so it will be possible to save a document again.
  doc._isNew = true;

  // Trigger the "afterRemove" event handlers.
  doc.dispatchEvent(new Astro.Event('afterRemove', {
    propagates: true
  }));

  return true;
};