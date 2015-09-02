var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._getOriginal = function(fieldName, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Set default options of the function. By default, we cast value being get
  // and get default value is none had been provided.
  options = _.extend({
    cast: true
  }, options);

  var fieldValue;
  Astro.utils.fields.traverseNestedFields(
    doc._original,
    fieldName,
    function(nestedField, nestedFieldName) {
      var Class;
      if (nestedField instanceof Astro.BaseClass) {
        Class = nestedField.constructor;
      }

      fieldValue = nestedField[nestedFieldName];

      if (Class) {
        // Check if a field definition exists.
        var field = Class.getField(nestedFieldName);

        if (field) {
          if (options.cast) {
            // Try casting the value to the proper type.
            fieldValue = field.cast(fieldValue);
          } else {
            // Otherwise get a plain value.
            fieldValue = field.plain(fieldValue);
          }
        }
      }
    }
  );

  return fieldValue;
};
