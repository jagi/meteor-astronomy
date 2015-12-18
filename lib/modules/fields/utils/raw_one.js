Astro.utils.fields.rawOne = function(doc, fieldPattern, options) {
  let utils = this;

  // Prepare options.
  options = _.extend({
    transient: true,
    immutable: true
  }, options);

  return utils.traverse(
    doc, fieldPattern,
    function(nestedDoc, nestedFieldName, field) {
      // If a field does not exist than we don't return anything.
      if (!field) {
        return;
      }

      // Don't get a transient field.
      if (!options.transient && field.transient) {
        return;
      }

      // Don't get an immutable field.
      if (!options.immutable && field.immutable) {
        return;
      }

      // Get a value to be returned.
      let fieldValue = nestedDoc[nestedFieldName];

      if (fieldValue instanceof Astro.Class) {
        return utils.rawAll(fieldValue, options);
      } else if (_.isArray(fieldValue)) {
        return _.map(fieldValue, function(element) {
          if (element instanceof Astro.Class) {
            return utils.rawAll(element, options);
          } else {
            return element;
          }
        });
      } else {
        return fieldValue;
      }
    }
  );
};