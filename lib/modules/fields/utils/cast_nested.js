Astro.utils.fields.castNested = function(doc) {
  let Class = doc.constructor;

  _.each(Class.getObjectFields(), function(field) {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (value === null || value === undefined) {
      return;
    }
    let NestedClass = field.class;
    if (!(value instanceof NestedClass)) {
      doc[field.name] = new NestedClass(value);
    }
  });

  _.each(Class.getListFields(), function(field) {
    let value = doc[field.name];
    // If field value is empty then go to the next one.
    if (value === null || value === undefined || !field.class) {
      return;
    }
    let NestedClass = field.class;
    _.each(value, function(element, index) {
      if (!(element instanceof NestedClass)) {
        value[index] = new NestedClass(element);
      }
    });
  });
};