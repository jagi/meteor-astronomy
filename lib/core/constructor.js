defaultConstructor = function(attrs) {
  var doc = this;
  var Class = doc.constructor;
  attrs = attrs || {};

  // Create "_values" property when legacy browsers support is turned on.
  if (!Astro.config.supportLegacyBrowsers) {
    doc._values = {};
  }

  // Set values of all fields.
  Astro.utils.fields.setAllValues(doc, attrs, {
    cast: true,
    default: true
  });

  // Create the "_original" property inside the document for storing original
  // object's values (before any modifications). Thanks to it, we can compare
  // "_original" values with the current values and decide what fields have been
  // modified. Now, let's copy current values to the original property but only
  // if there is the "_id" property. Otherwise we only copy the "_id" property.
  // Thanks to that, if there is no "_id" property, then we can set fields of
  // the new document on the initiation stage. If there is the "_id" property
  // it means that we are fetching document from the collection.
  if (_.isString(attrs._id)) {
    doc._original = EJSON.clone(Astro.utils.fields.getAllValues(doc, {
      cast: false,
      default: false,
      plain: false
    }));
  } else {
    doc._original = {
      _id: attrs._id
    };
  }

  // Set the "_isNew" flag indicating if an object had been persisted in the
  // collection.
  doc._isNew = true;
};
