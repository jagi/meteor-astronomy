let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods.remove = function(Class, args, originalMethod) {
  let Collection = Class.getCollection();
  let selector = args[0];
  let callback = args[1];

  // Throw exception if we are trying to remove more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'remove');

  // Get documents to be removed.
  let docs = Collection.find(selector);

  let result = 0;
  docs.forEach(function(doc, index) {
    // Remove only when document has the "_id" field (it's persisted).
    if (!doc._id) {
      return doc;
    }

    // Trigger the "beforeRemove" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      return;
    }

    // Execute the original method.
    result += originalMethod.call(this, doc._id, callback);

    // Clear the "_id" attribute.
    doc._id = null;

    // Set a document as a new, so it will be possible to save document again.
    doc._isNew = true;

    // Trigger the "afterRemove" event handlers.
    doc.dispatchEvent(new Astro.Event('afterRemove', {
      propagates: true
    }));
  }, this);

  return result;
};