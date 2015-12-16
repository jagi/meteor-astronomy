Astro.utils.fields.rawOne = function(doc, fieldPattern, options) {
  let self = this;

  // Prepare options.
  options = _.extend({
    transient: true
  }, options);

  return self.traverse(
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

      // Get a value to be returned.
      let fieldValue = nestedDoc[nestedFieldName];

      if (fieldValue instanceof Astro.Class) {
        return self.rawAll(fieldValue, options);
      } else if (_.isArray(fieldValue)) {
        return _.map(fieldValue, function(element) {
          if (element instanceof Astro.Class) {
            return self.rawAll(element, options);
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