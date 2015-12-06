let methods = Astro.Module.modules.storage.meteorMethods;

methods.classRemove = function(className, selector) {
  let Class = Astro.Class.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs = Collection.find(selector);

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach(function(doc) {
    // Trigger the "beforeRemove" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      throw new Meteor.Error(403, 'Operation prevented');
    }

    // Catch any error that may be caused by unability to remove a document. The
    // thrown error can be handled in the `removeMongoError` event.
    try {
      // Remove a document.
      result += Collection._collection.remove({_id: doc._id});
    }
    catch (error) {
      if (error.name === 'MongoError') {
        if (!doc.dispatchEvent(new Astro.Event('removeMongoError', {
          error: error
        }))) {
          // If an event was prevented, then we stop here.
          throw new Meteor.Error(403, 'Operation prevented');
        }
      }

      throw error;
    }

    // Clear the "_id" attribute.
    doc._id = null;
    // Set document as a new, so it will be possible to save a document again.
    doc._isNew = true;

    // Trigger the "afterRemove" event handlers.
    doc.dispatchEvent(new Astro.Event('afterRemove', {
      propagates: true
    }));
  });

  return result;
};