let collectionMethods = Astro.Module.modules.storage.collectionMethods;

collectionMethods.find =
collectionMethods.findOne = function(Class, args, originalMethod) {
  let Collection = Class.getCollection();
  let selector = Mongo.Collection._rewriteSelector(
    Collection._getFindSelector(args)
  );
  let options = Collection._getFindOptions(args);
  let result;

  // Modify selector and options using the "beforeFind" event handlers.
  if (!Collection.dispatchEvent(new Astro.Event('beforeFind', {
    selector: selector,
    options: options
  }))) {
    // If an event was prevented, then we stop here.
    return;
  }

  // If it's an inherited class, then get only documents being instances of
  // the subclass.
  let typeField = Class.getTypeField();
  if (typeField) {
    selector[typeField] = Class.getName();
  }

  // Add the transformation function.
  options.transform = Class.getTransform();

  // Execute the original method.
  result = originalMethod.call(this, selector, options);

  // Modify a query result using the "afterFind" event handlers.
  if (!Collection.dispatchEvent(new Astro.Event('afterFind', {
    selector: selector,
    options: options,
    result: result
  }))) {
    // If an event was prevented, then we stop here.
    return;
  }

  return result;
};