Astro.utils.validators.validate = function(doc) {
  let utils = this;

  let Class = doc.constructor;
  let fields = Class.getFields();

  _.each(fields, function(field) {
    let fieldName = field.name;
    let fieldValue = doc[fieldName];

    // We do not validate transient fields.
    if (field.transient) {
      return;
    }

    field.validate(doc, fieldName);

    // If it is the "one" nested field then validate it.
    if (field instanceof Astro.OneNestedField) {
      if (fieldValue instanceof Astro.Class) {
        utils.validate(fieldValue);
      }
    }
    // If it is the "many" nested field then validate each one.
    else if (field instanceof Astro.ManyNestedField && field.class) {
      _.each(fieldValue, function(element) {
        if (element instanceof Astro.Class) {
          utils.validate(element);
        }
      });
    }
  });
};