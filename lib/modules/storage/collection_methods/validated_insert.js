let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods._validatedInsert = function(Class, args, originalMethod) {
  let userId = args[0];
  let attrs = args[1];
  let generatedId = args[2];
  let result;

  // Create a new document to insert.
  let doc = new Class(attrs);

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

  // Get values to be inserted.
  attrs = _.omit(doc._rawAll(), '_id');
  // Execute the original method.
  result = originalMethod.call(this, userId, attrs, generatedId);

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