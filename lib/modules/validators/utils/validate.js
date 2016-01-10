Astro.utils.validators.validate = function(doc) {
  let utils = this;

  let Class = doc.constructor;
  let fields = Class.getFields();

  _.each(fields, function(field) {
    let value = doc[field.name];

    // We do not validate transient fields.
    if (field.transient) {
      return;
    }

    field.validate(doc, field.name);

    // If it is the object field then validate it.
    if (field instanceof Astro.ObjectField) {
      if (value instanceof Astro.Class) {
        utils.validate(value);
      }
    }
    // If it is the list field then validate each one.
    else if (field instanceof Astro.ListField && field.class) {
      _.each(value, function(element) {
        if (element instanceof Astro.Class) {
          utils.validate(element);
        }
      });
    }
  });
};