fieldsOnInitInstance = function(attrs) {
  var self = this;
  var Class = self.constructor;
  attrs = attrs || {};

  // Create "_original" per instance for storing object's values but these
  // values have to be copies of "_values" object using "EJSON.clone" method.
  // Thanks to that we will be able to determine modified fields using
  // "EJSON.equals" method.
  self._original = {};

  // Create "_values" per instance for storing object's values.
  self._values = {};

  // Get all fields names of this object's class and parent classes.
  var fieldsNames = Astro.utils.class.getNamesOfAllFields(Class);

  var values = {};

  // Try setting default value for each field.
  _.each(fieldsNames, function(fieldName) {
    if (_.has(attrs, fieldName)) {
      values[fieldName] = attrs[fieldName];
    } else {
      values[fieldName] = Astro.utils.class.getDefaultValueOfField(
        self.constructor, fieldName
      );
    }
  });

  // Assing values directly to object.
  _.extend(self, values);

  // Store copy of the values in the "_original" property.
  self._original = EJSON.clone(values);
};
