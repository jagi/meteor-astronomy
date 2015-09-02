var proto = Astro.BaseClass.prototype;

// Utils.

proto._addModifier = function(modifier, fieldName, fieldValue) {
  var doc = this;

  var allowedModifiers = ['$set', '$push'];

  if (!_.contains(allowedModifiers, modifier)) {
    return;
  }

  // Create a modifier group it does not exist.
  doc._modifier[modifier] = doc._modifier[modifier] || {};

  if (modifier === '$set') {
    // Get an original field's value.
    var originalValue = doc._getOriginal(fieldName);
    // If a value has changed then add modifier.
    if (!EJSON.equals(originalValue, fieldValue)) {
      doc._modifier[modifier][fieldName] = fieldValue;
    }
  } else if (modifier === '$push') {

  }
};

proto._getModifier = function() {
  var doc = this;
  var Class = doc.constructor;

  var modifier = {};

  if (_.has(doc._modifier, '$set')) {
    modifier.$set = {};

    _.each(doc._modifier.$set, function(fieldValue, fieldName) {
      var originalValue = doc._getOriginal(fieldName);
      if (!EJSON.equals(originalValue, fieldValue)) {
        modifier.$set[fieldName] = fieldValue;
      }
    });
  }

  return modifier;
};
