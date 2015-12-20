Astro.utils.fields.setOne = function(doc, fieldPattern, fieldValue, options) {
  // Prepare options.
  options = _.extend({
    default: false
  }, options);

  return this.traverse(
    doc, fieldPattern,
    function(nestedDoc, nestedFieldName, field) {
      // If a field does not exist than we don't return anything.
      if (!field) {
        let Class = doc.constructor;
        Astro.utils.core.warn(
          '["' + Class.getName() + '" class]["' + fieldPattern + '" field] ' +
          'Trying to set a value of the field that does not exist in the class'
        );
        return;
      }

      // Declare a variable for storing a value that will be set.
      let setValue;

      if (fieldValue === undefined && options.default) {
        // If a value being set is undefined and we are initiating data, then we
        // get a default value of a field.
        setValue = field.getDefault();
      } else {
        setValue = fieldValue;
      }

      nestedDoc[nestedFieldName] = setValue;
    }
  );
};