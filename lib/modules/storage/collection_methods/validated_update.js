let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods._validatedUpdate = function(Class, args, originalMethod) {
  let Collection = Class.getCollection();
  let userId = args[0];
  let selector = args[1];
  let modifier = args[2];
  let options = args[3] || {};
  let result = 0;

  // Throw exception if we are trying to update more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'update');

  // Get documents to update.
  let docs;
  if (options.multi) {
    docs = Collection.find(selector);
  } else {
    docs = Collection.find(selector, {limit: 1});
  }

  docs.forEach(function(doc) {
    // Make sure that a document is instance of the Class class.
    if (!(doc instanceof Astro.Class)) {
      doc = new Class(doc);
    }

    // Apply $set modifier.
    if (modifier.$set) {
      _.each(modifier.$set, function(fieldValue, fieldPattern) {
        doc._setOne(fieldPattern, fieldValue);
      });
    }
    // Apply $inc modifier.
    if (modifier.$inc) {
      _.each(modifier.$inc, function(incValue, fieldPattern) {
        let fieldValue = doc._getOne(fieldPattern);
        doc._setOne(fieldPattern, fieldValue + incValue);
      });
    }

    // FIXME: Solve problem of many different modifiers and casting values.
    Astro.utils.fields.castNested(doc);

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

    // Get modified values.
    let modified = doc.getModified();
    // If there were any modifications.
    if (_.size(modified) > 0) {
      // Execute the original method.
      result += originalMethod.call(this, userId, {_id: doc._id}, {
        $set: modified
      });
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
  }, this);

  return result;
};