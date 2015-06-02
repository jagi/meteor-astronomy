defaultConstructor = function(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Get all fields names of this object's class and parent classes.
  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  // Set values of all fields.
  Astro.utils.fields.setValuesOfAllFields(doc, attrs);

  // Create the "_original" property inside the document for storing original
  // object's values (before any modifications). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified. Now, let's copy current values to the original property.
  doc._original = EJSON.clone(Astro.utils.fields.getValuesOfAllFields(doc));
};
