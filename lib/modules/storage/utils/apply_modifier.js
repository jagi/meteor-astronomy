Astro.utils.storage.applyModifier = function(doc, modifier) {
  // Apply $set modifier.
  if (modifier.$set) {
    _.each(modifier.$set, function(fieldValue, fieldPattern) {
      Astro.utils.fields.setOne(doc, fieldPattern, fieldValue);
    });
  }

  // Apply $push modifier.
  if (modifier.$push) {
    _.each(modifier.$push, function(pushValue, fieldPattern) {
      var fieldValue = Astro.utils.fields.getOne(doc, fieldPattern);
      // If field value is empty then set it to an empty array.
      if (fieldValue === null || fieldValue === undefined) {
        fieldValue = [];
      }
      // If field value is not an erray then throw exception.
      else if (!_.isArray(fieldValue)) {
        throw new Meteor.Error(
          409, 'MinimongoError: Cannot apply $push modifier to non-array'
        );
      }
      // Push a value.
      fieldValue.push(pushValue);
      Astro.utils.fields.setOne(doc, fieldPattern, fieldValue);
    });
  }

  // Apply $inc modifier.
  if (modifier.$inc) {
    _.each(modifier.$inc, function(incValue, fieldPattern) {
      let fieldValue = Astro.utils.fields.getOne(doc, fieldPattern);
      fieldValue += incValue;
      Astro.utils.fields.setOne(doc, fieldPattern, fieldValue);
    });
  }

  Astro.utils.fields.castNested(doc);

  return {
    $set: doc.getModified()
  };
};