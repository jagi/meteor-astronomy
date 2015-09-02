var BaseClass = Astro.BaseClass = function BaseClass(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Add the private "_modifier" property to track changes made on the document.
  doc._clearModifiers();

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
    doc._setDefault(fieldName);
  });

  // Set values of all fields.
  doc._setMany(attrs, {
    cast: true,
    modifier: true
  });

  // 1. Create the "_original" property inside the document for storing original
  // object's values (before any modifications). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified.
  // 2. Copy values to the "_original" property, if it's an already saved
  // document fetched from the collection or a document that does not get stored
  // in the collection directly.
  if (attrs._id || !Class.getCollection()) {
    doc._original = EJSON.clone(doc._getAll());
  } else {
    doc._original = {
      _id: attrs._id
    };
  }

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
