var proto = Astro.BaseClass.prototype;

// Utils.

proto._addModifier = function(modifier, fieldName, fieldValue) {
  var doc = this;

  var allowedModifiers = ['$set', '$push'];

  if (!_.contains(allowedModifiers, modifier)) {
    return;
  }

  doc._modifier[modifier] = doc._modifier[modifier] || {};
  doc._modifier[modifier][fieldName] = fieldValue;
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

  console.log(modifier);

  return modifier;
};

proto._clearModifier = function() {
  var doc = this;

  doc._modifier = {};
};
