let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods._validatedRemove = function(Class, args, originalMethod) {
  let Collection = Class.getCollection();
  let userId = args[0];
  let selector = args[1];
  let result = 0;

  // Throw exception if we are trying to remove more than one document at once.
  Astro.utils.storage.throwIfSelectorIsNotId(Collection, selector, 'remove');

  // Get documents to remove.
  let docs = Collection.find(selector).fetch();

  docs.forEach(function(doc) {
    // Make sure that a document is instance of the Class class.
    if (!(doc instanceof Astro.Class)) {
      doc = new Class(doc);
    }

    // Trigger the "beforeRemove" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
      cancelable: true, propagates: true
    }))) {
      // If an event was prevented, then we stop here.
      throw new Meteor.Error(403, 'Operation prevented');
    }

    // Execute the original method.
    result += originalMethod.call(this, userId, {_id: doc._id});

    // Clear the "_id" attribute.
    doc._id = null;

    // Set document as a new, so it will be possible to save document again.
    doc._isNew = true;

    // Trigger the "afterRemove" event handlers.
    doc.dispatchEvent(new Astro.Event('afterRemove', {
      propagates: true
    }));
  }, this);

  return result;
};