var proto = Astro.BaseClass.prototype;

// Utils.

proto._addModifier = function(modifier, fieldName, fieldValue) {
  var doc = this;

  var allowedModifiers = ['$set', '$push'];

  if (!_.contains(allowedModifiers, modifier)) {
    return;
  }

  doc._modifiers[modifier] = doc._modifiers[modifier] || {};
  doc._modifiers[modifier][fieldName] = fieldValue;
};

proto._getModifiers = function() {
  var doc = this;

  return doc._modifiers;
};

proto._clearModifiers = function() {
  var doc = this;

  doc._modifiers = {};
};
