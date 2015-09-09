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
  Astro.utils.fields.traverseNestedDocs(
    doc._original,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      if (_.isUndefined(index)) {
        fieldValue = nestedDoc[nestedFieldName];
      } else {
        fieldValue = nestedDoc[nestedFieldName][index];
      }

      if (field) {
        if (options.cast && field.needsCast(fieldValue)) {
          // Try casting the value to the proper type.
          fieldValue = field.cast(fieldValue);
        } else if (!options.cast && field.needsPlain(fieldValue)) {
          // Otherwise get a plain value.
          fieldValue = field.plain(fieldValue);
        }
      }
    }
  );

  return fieldValue;
};
