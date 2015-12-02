let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods.insert = function(Class, args, originalMethod) {
  let attrs = args[0];
  let callback = args[1];

  // Create a new document to insert.
  let doc = new Class(attrs);

  // Trigger the "beforeSave" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeSave', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    return;
  }
  // Trigger the "beforeInsert" event handlers.
  if (!doc.dispatchEvent(new Astro.Event('beforeInsert', {
    cancelable: true, propagates: true
  }))) {
    // If an event was prevented, then we stop here.
    return;
  }

  // Get plain values of all fields. Pick only values that we want to save.
  let values = Astro.utils.fields.rawAll(doc, {
    transient: false
  });
  // If, we are inserting a document with the null "_id", then we have to
  // remove it.
  if (values._id === null) {
    values = _.omit(values, '_id');
  }
  // Execute the original method.
  let result = originalMethod.call(this, values, callback);

  // Change the "_isNew" flag to "false". Now a document is not new.
  doc._isNew = false;

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