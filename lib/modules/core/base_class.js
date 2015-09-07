var BaseClass = Astro.BaseClass = function BaseClass(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Add the private "_modifiers" property to track changes made on the document.
  doc._modifiers = {};
  // Add the private "_original" property to store the original document before
  // modifications.
  doc._original = {};

  // Call the "beforeInit" events defined on the class level.
  Class.schema.each('beforeInit', function(eventHandler) {
    eventHandler.call(doc, attrs);
  });
  // Call the "beforeInit" events defined globally.
  Astro.eventManager.each('beforeInit', function(eventHandler) {
    eventHandler.call(doc, attrs);
  });

  // Set default values.
  var fieldsNames = Class.getFieldsNames();
  _.each(fieldsNames, function(fieldName) {
    // Set a default value.
    doc._setDefault(fieldName);
  });

  // Set values of all fields.
  doc._setMany(attrs, {
    cast: true,
    modifier: false
  });

  // Copy values to the "_original" property.
  _.each(fieldsNames, function(fieldName) {
    doc._original[fieldName] = EJSON.clone(doc[fieldName]);
  });

  // Set the "_isNew" flag indicating if an object had been persisted in the
  // collection.
  doc._isNew = true;

  // Call the "afterInit" events defined on the class level.
  Class.schema.each('afterInit', function(eventHandler) {
    eventHandler.call(doc, attrs);
  });
  // Call the "afterInit" events defined globally.
  Astro.eventManager.each('afterInit', function(eventHandler) {
    eventHandler.call(doc, attrs);
  });
};
