Astro.utils.storage.documentUpdate = function(doc) {
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare result of the method execution.
  let result;

  // Before we start saving a document, we have to make sure that all nested
  // fields are casted onto the proper types.
  Astro.utils.fields.castNested(doc);

  // Trigger the "beforeSave" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeSave'
    });
  }
  // Trigger the "beforeUpdate" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeUpdate', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeUpdate'
    });
  }

  // Validate types of document's fields.
  Astro.utils.validators.validate(doc);

  // Catch any error that may be caused by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The thrown error can be
  // handled in the `saveMongoError` event.
  try {

    // Get modified values.
    let modified = Astro.utils.storage.getModified(doc);
    // If there were any modifications.
    if (_.size(modified) > 0) {
      // Update a document.
      result = Collection._collection.update({_id: doc._id}, {
        $set: modified
      });
    }
    // If there were no modified fields, then we just return 0.
    else {
      return 0;
    }

  }
  catch (err) {
    if (err.name === 'MongoError') {
      if (!doc.dispatchEvent(new Astro.Event('mongoError', {
        error: err, operation: 'update', cancelable: true
      }))) {
        return 0;
      }
    }

    throw err;
  }

  // Trigger the "afterUpdate" event handlers.
  doc.dispatchEvent(new Astro.Event('afterUpdate', {
    propagates: true
  }));
  // Trigger the "afterSave" event handlers.
  doc.dispatchEvent(new Astro.Event('afterSave', {
    propagates: true
  }));

  return result;
};