let classPrototypeMethods = Astro.Module.modules.storage.classPrototypeMethods;

classPrototypeMethods.remove = function(callback) {
  let doc = this;
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
    return false;
  }

  // Remove a document with Astronomy disabled.
  Astro.nonEnabled(function() {
    Collection.remove(doc._id, callback);
  });

  // Clear the "_id" attribute.
  doc._id = null;
  // Set document as a new, so it will be possible to save document again.
  doc._isNew = true;

  // Trigger the "afterRemove" event handlers.
  doc.dispatchEvent(new Astro.Event('afterRemove', {
    propagates: true
  }));

  return true;
};
