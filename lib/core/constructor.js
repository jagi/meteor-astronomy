defaultConstructor = function(attrs) {
  var self = this;
  var Class = self.constructor;
  attrs = attrs || {};

  // Create the "_original" property inside this instance for storing original
  // object's values (before any modification). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified.
  self._original = {};

  // Get all fields names of this object's class and parent classes.
  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  // Try setting default value for each field.
  var values = {};
  _.each(fieldsNames, function(fieldName) {
    if (_.has(attrs, fieldName)) {
      // If field's value has been provided then try casting its value.
      values[fieldName] = Astro.utils.fields.castValueOfField(
        Class,
        fieldName,
        attrs[fieldName]
      );
    } else {
      // If field's has not been provided then try getting default value.
      values[fieldName] = Astro.utils.fields.getDefaultValueOfField(
        self.constructor, fieldName
      );
    }
  });

  // Assing values directly to object.
  _.extend(self, values);

  // Store copy of the values in the "_original" property.
  self._original = EJSON.clone(values);
};
