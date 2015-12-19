var BaseClass = Astro.BaseClass = function BaseClass(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Add the private "_modifiers" property to track changes made on the document.
  doc._modifiers = {};

  // Trigger the "beforeInit" event handlers.
  event = new Astro.Event('beforeInit', attrs);
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  var fieldsNames = Class.getFieldsNames();
  _.each(fieldsNames, function(fieldName) {
    var fieldValue = attrs[fieldName];
    if (_.isUndefined(fieldValue)) {
      // Set a default value.
      doc._setDefault(fieldName);
    } else {
      // Set a value.
      doc._setOne(fieldName, fieldValue, {
        cast: true,
        modifier: false,
        mutable: true
      });
    }
  });

  // Set the "_isNew" flag indicating if an object had been persisted in the
  // collection.
  doc._isNew = true;

  // Trigger the "afterInit" event handlers.
  event = new Astro.Event('afterInit', attrs);
  event.target = doc;
  Class.emitEvent(event);
};

// Add the "_original" property for backward compatibility that will be lazy
// executed.
Object.defineProperty(BaseClass.prototype, '_original', {
  get: function() {
    var doc = this;
    var Class = doc.constructor;

    if (doc._id) {
      var originalDoc = Class.findOne(doc._id);
    } else {
      var originalDoc = new Class();
    }

    var _original = {};
    var fieldsNames = Class.getFieldsNames();
    _.each(fieldsNames, function(fieldName) {
      _original[fieldName] = originalDoc[fieldName];
    });

    return _original;
  },
  enumerable: false,
  configurable: false
});
