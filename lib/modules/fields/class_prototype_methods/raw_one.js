let methods = Astro.Module.modules.fields.classPrototypeMethods;

methods._rawOne = function(fieldPattern, options) {
  let doc = this;

  // Prepare options.
  options = _.extend({
    transient: true
  }, options);

  return Astro.utils.fields.traverse(
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
      var fieldValue = nestedDoc[nestedFieldName];

      if (fieldValue instanceof Astro.Class) {
        return fieldValue._rawAll(fieldValue, options);
      } else if (_.isArray(fieldValue)) {
        return _.map(fieldValue, function(element) {
          if (element instanceof Astro.Class) {
            return element._rawAll(element, options);
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