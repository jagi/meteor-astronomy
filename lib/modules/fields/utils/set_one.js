Astro.utils.fields.setOne = function(doc, fieldPattern, fieldValue) {
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

      nestedDoc[nestedFieldName] = fieldValue;
    }
  );
};