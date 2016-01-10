Astro.utils.storage.documentInsert = function(doc) {
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Prepare result of the method execution.
  let result;

  // Trigger the "beforeSave" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeSave'
    });
  }
  // Trigger the "beforeInsert" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeInsert', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error('prevented', 'Operation prevented', {
      eventName: 'beforeInsert'
    });
  }

  // Generate ID if not provided.
  if (!doc._id) {
    doc._id = Collection._makeNewID();
  }

  // Validate types of document's fields.
  Astro.utils.validators.validate(doc);

  // Catch any error that may be caused by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The thrown error can be
  // handled in the `saveMongoError` event.
  try {

    // Get plain values of all fields. Pick only values that we want to save.
    let values = Astro.utils.fields.rawAll(doc, {
      transient: false
    });
    // Insert a document.
    Collection._collection.insert(values);
    // There is a difference in what the insert method returns depending on the
    // environment. On the client it returns an inserted document id, on the
    // server it returns array of inserted documents. So we always return the
    // generated id. We can't send an entire document because it could be a
    // security issue if we are not subscribed to all fields of a document.
    result = doc._id;
    // Change the "_isNew" flag to "false". Now a document is not new.
    doc._isNew = false;

  }
  catch (err) {
    if (err.name === 'MongoError') {
      if (!doc.dispatchEvent(new Astro.Event('mongoError', {
        error: err, operation: 'insert', cancelable: true
      }))) {
        return doc._id;
      }
    }

    throw err;
  }

  // Trigger the "afterInsert" event handlers.
  doc.dispatchEvent(new Astro.Event('afterInsert', {
    propagates: true
  }));
  // Trigger the "afterSave" event handlers.
  doc.dispatchEvent(new Astro.Event('afterSave', {
    propagates: true
  }));

  return result;
};