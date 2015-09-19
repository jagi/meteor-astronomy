var BaseClass = Astro.BaseClass = function BaseClass(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Add the private "_modifiers" property to track changes made on the document.
  doc._modifiers = {};
  // Add the private "_original" property to store the original document before
  // modifications.
  doc._original = {};

  // Trigger the "beforeInit" event handlers.
  event = new Astro.Event('beforeInit', attrs);
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Set default values.
  var fieldsNames = Class.getFieldsNames();
  _.each(fieldsNames, function(fieldName) {
    // Set a default value.
    doc._setDefault(fieldName);
  });

  // Set values of all fields.
  doc._setMany(attrs, {
    cast: true,
    modifier: false,
    mutable: true
  });

  // Copy values to the "_original" property.
  _.each(fieldsNames, function(fieldName) {
    doc._original[fieldName] = EJSON.clone(doc[fieldName]);
  });

  // Set the "_isNew" flag indicating if an object had been persisted in the
  // collection.
  doc._isNew = true;

  // Trigger the "afterInit" event handlers.
  event = new Astro.Event('afterInit', attrs);
  event.target = doc;
  Class.emitEvent(event);
};
