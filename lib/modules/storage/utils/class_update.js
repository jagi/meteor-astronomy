Astro.utils.storage.classUpdate = function(
  className, selector, modifier, options
) {
  let Class = Astro.Class.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs;
  if (options.multi) {
    docs = Class.find(selector);
  } else {
    docs = Class.find(selector, {limit: 1});
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

		// Validate a document.
		Astro.utils.validators.documentValidate(doc);

    // If there were any modifications.
    if (_.size(modifier) > 0) {
      // Update a document.
      result += Collection._collection.update({_id: doc._id}, modifier);
    }
    // No fields were modified, so we just go to the next document.
    else {
      return;
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