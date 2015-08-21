var BaseClass = Astro.BaseClass = function BaseClass(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Set values of all fields.
  Astro.utils.fields.setAllValues(doc, attrs, {
    cast: true,
    default: true
  });

  // 1. Create the "_original" property inside the document for storing original
  // object's values (before any modifications). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified.
  // 2. Copy values to the "_original" property, if it's an already saved
  // document fetched from the collection or a document that does not get stored
  // in the collection directly.
  if (attrs._id || !Class.getCollection()) {
    doc._original = EJSON.clone(Astro.utils.fields.getAllValues(doc));
  } else {
    doc._original = {
      _id: attrs._id
    };
  }

  // Set the "_isNew" flag indicating if an object had been persisted in the
  // collection.
  doc._isNew = true;

  // Call global constructors by triggering the "initInstance" event. These
  // constructors are mainly defined by modules and behaviors.
  Astro.eventManager.each('initInstance', function(eventHandler) {
    eventHandler.apply(doc, attrs);
  });

  // Call user defined constructor.
  Class.getConstructor().apply(doc, attrs);
};

BaseClass.prototype.valueOf = function() {
  var doc = this;

  return Astro.utils.fields.getAllValues(doc, {
    cast: false,
    default: true
  });
};
