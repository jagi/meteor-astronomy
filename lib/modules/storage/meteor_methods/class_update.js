let methods = Astro.Module.modules.storage.meteorMethods;

methods.classUpdate = function(className, selector, modifier, options) {
  let Class = Astro.Class.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs;
  if (options.multi) {
    docs = Collection.find(selector);
  } else {
    docs = Collection.find(selector, {limit: 1});
  }

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach(function(doc) {
    modifier = Astro.utils.storage.applyModifier(doc, modifier);

    // Trigger the "beforeSave" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      throw new Meteor.Error(403, 'Operation prevented');
    }
    // Trigger the "beforeUpdate" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeUpdate', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      throw new Meteor.Error(403, 'Operation prevented');
    }

    // Catch any error that may be caused by unability to update a document.
    // The thrown error can be handled in the `removeMongoError` event.
    try {
      // Get modified values.
      let modified = doc.getModified();
      // If there were any modifications.
      if (_.size(modified) > 0) {
        // Update a document.
        result += Collection._collection.update(
          {_id: doc._id}, {$set: modified}
        );
      }
      // No fields were modified, so we just go to the next document.
      else {
        return;
      }
    }
    catch (error) {
      if (error.name === 'MongoError') {
        if (!doc.dispatchEvent(new Astro.Event('updateMongoError', {
          error: error
        }))) {
          // If an event was prevented, then we stop here.
          throw new Meteor.Error(403, 'Operation prevented');
        }
      }

      throw error;
    }

    // Change the "_isNew" flag to "false". Now a document is not new.
    doc._isNew = false;

    // Trigger the "afterUpdate" event handlers.
    doc.dispatchEvent(new Astro.Event('afterUpdate', {
      propagates: true
    }));
    // Trigger the "afterSave" event handlers.
    doc.dispatchEvent(new Astro.Event('afterSave', {
      propagates: true
    }));
  });

  return result;
};