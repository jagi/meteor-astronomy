let methods = Astro.Module.modules.storage.classStaticMethods;

_.each(['find', 'findOne'], function(methodName) {
  methods[methodName] = function() {
    let Class = this;
    let Collection = Class.getCollection();

    // Get selector and options from the arguments.
    let selector = Mongo.Collection._rewriteSelector(
      Collection._getFindSelector(arguments)
    );
    let options = Collection._getFindOptions(arguments);

    // Modify selector and options using the "beforeFind" event handlers.
    // Class.dispatchEvent(new Astro.Event('beforeFind', {
    //   selector: selector, options: options
    // }));

    // If it's an inherited class, then get only documents being instances of
    // the subclass.
    let typeField = Class.getTypeField();
    if (typeField) {
      selector[typeField] = Class.getName();
    }

    // We always ass the transformation function.
    options.transform = Class.getTransform();

    // Execute the original method.
    let result = Collection[methodName](selector, options);

    // Modify a query result using the "afterFind" event handlers.
    // Class.dispatchEvent(new Astro.Event('afterFind', {
    //   selector: selector, options: options, result: result
    // }));

    return result;
  };
});