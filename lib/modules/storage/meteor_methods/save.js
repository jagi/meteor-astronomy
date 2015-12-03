let methods = Astro.Module.modules.storage.meteorMethods;

methods.save = function(doc) {
  let Class = doc.constructor;
  let Collection = Class.getCollection();

  // Set the flag indicating whether we are updating or instering a document.
  let inserting = doc._isNew;

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
  // Trigger the "beforeInsert" or "beforeUpdate" event handlers.
  if (!doc.dispatchEvent(new Astro.Event(
    inserting ? 'beforeInsert' : 'beforeUpdate', {
      cancelable: true, propagates: true
    }
  ))) {
    // If an event was prevented, then we stop here.
    throw new Meteor.Error(403, 'Operation prevented');
  }

  // Catch any error that may be cause by unability to save a document. It may
  // be a Mongo exception for an index uniqueness etc. The returned error can be
  // handled in the `saveError` event.
  try {
    // Inserting.
    if (inserting) {

      // Get plain values of all fields. Pick only values that we want to save.
      let values = doc._rawAll({
        transient: false
      });
      // If, we are inserting a document with the null "_id", then we have to
      // remove it.
      if (values._id === null) {
        values = _.omit(values, '_id');
      }
      // Insert a document.
      Collection._collection.insert(values);

    }
    // Updating.
    else {

      // Get modified values.
      let modified = doc.getModified();
      // If there were any modifications.
      if (_.size(modified) > 0) {
        // Update a document.
        Collection._collection.update({_id: doc._id}, {
          $set: modified
        });
      }
      // If there were no modified fields, then we just return true.
      else {
        return doc;
      }
    }
  } catch (e) {
    if (e.name === 'MongoError') {
      if (!doc.dispatchEvent(new Astro.Event('saveError', {
        error: e
      }))) {
        // If an event was prevented, then we stop here.
        throw new Meteor.Error(403, 'Operation prevented');
      }
    }

    throw e;
  }

  // Change the "_isNew" flag to "false". Now a document is not new.
  doc._isNew = false;

  // Trigger the "afterInsert" or "afterUpdate" event handlers.
  doc.dispatchEvent(new Astro.Event(
    inserting ? 'afterInsert' : 'afterUpdate', {
      propagates: true
    }
  ));
  // Trigger the "afterSave" event handlers.
  doc.dispatchEvent(new Astro.Event('afterSave', {
    propagates: true
  }));

  return doc;
};