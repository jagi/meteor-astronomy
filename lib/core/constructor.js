defaultConstructor = function(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Create the "_original" property inside the document for storing original
  // object's values (before any modifications). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified.
  doc._original = {};

  // Get all fields names of this object's class and parent classes.
  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  // Try setting default value for each field.
  _.each(fieldsNames, function(fieldName) {
    if (_.has(attrs, fieldName)) {
      // If field's value has been provided then try casting its value.
      doc[fieldName] = Astro.utils.fields.castValueOfField(
        Class,
        fieldName,
        attrs[fieldName]
      );
      doc._original[fieldName] = EJSON.clone(doc[fieldName]);
    } else {
      // If field's has not been provided then try getting default value.
      doc[fieldName] = Astro.utils.fields.getDefaultValueOfField(
        doc.constructor, fieldName
      );
      if (!attrs._id) {
        doc._original[fieldName] = EJSON.clone(doc[fieldName]);
      }
    }
  });
};
