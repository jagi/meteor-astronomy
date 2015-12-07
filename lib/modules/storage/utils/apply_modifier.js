Astro.utils.storage.applyModifier = function(doc, modifier) {
  // Apply $set modifier.
  if (modifier.$set) {
    _.each(modifier.$set, function(fieldValue, fieldPattern) {
      doc._setOne(fieldPattern, fieldValue);
    });
  }
  // Apply $inc modifier.
  if (modifier.$inc) {
    _.each(modifier.$inc, function(incValue, fieldPattern) {
      let fieldValue = doc._getOne(fieldPattern);
      doc._setOne(fieldPattern, fieldValue + incValue);
    });
  }

  Astro.utils.fields.castNested(doc);

  return {
    $set: doc.getModified()
  };
};