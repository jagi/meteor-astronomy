var proto = Astro.BaseClass.prototype;

proto._setDefault = function(fieldName, options) {
  var doc = this;

  // Set default options of the function. By default, we cast value being set.
  options = _.extend({
    modifier: true
  }, options);

  doc._traverseNestedFields(
    fieldName,
    function(nestedDoc, nestedFieldName) {
      // We can not get a default value for a nested document that is not an
      // astronomy document.
      if (!(nestedDoc instanceof Astro.BaseClass)) {
        return;
      }

      // Get the class for a nested document.
      var Class = nestedDoc.constructor;

      // Check if a field definition exists.
      var field = Class.getField(nestedFieldName);

      // If there is no field definition, then we can't get a default value.
      if (!field) {
        return;
      }

      // Get a default value casted to the proper type.
      var fieldValue = field.getDefault();

      // Set the given value on the document.
      nestedDoc[nestedFieldName] = fieldValue;

      // Add modifier.
      if (options.modifier) {
        nestedDoc._addModifier('$set', nestedFieldName, fieldValue);
      }
    }
  );
};
