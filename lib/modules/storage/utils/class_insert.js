Astro.utils.storage.classInsert = function(className, values) {
  let Class = Astro.Class.get(className);
  let Collection = Class.getCollection();

  // Create a new document.
  let doc = new Class(values);

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
    throw new Meteor.Error(403, 'Operation prevented');
  }
  // Trigger the "beforeInsert" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeInsert', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error(403, 'Operation prevented');
  }

  // Catch any error that may be caused by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The thrown error can be
  // handled in the `saveMongoError` event.
  try {

    // Get plain values of all fields. Pick only values that we want to save.
    let values = doc._rawAll({
      transient: false
    });
    // Generate id if not provided.
    if (values._id === null) {
      values._id = Collection._makeNewID();
    }
    // Insert a document.
    Collection._collection.insert(values);
    // There is a difference in what the insert method returns depending on the
    // environment. On the client it returns an inserted document id, on the
    // server it returns array of inserted documents. So we always return the
    // generated id. We can't send an entire document because it could be a
    // security issue if we are not subscribed to all fields of a document.
    result = values._id;
    // Change the "_isNew" flag to "false". Now a document is not new.
    doc._isNew = false;

  } catch (e) {
    if (e.name === 'MongoError') {
      if (!doc.dispatchEvent(new Astro.Event('saveMongoError', {
        error: e
      }))) {
        // If an event was prevented, then we stop here.
        throw new Meteor.Error(403, 'Operation prevented');
      }
    }

    throw e;
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