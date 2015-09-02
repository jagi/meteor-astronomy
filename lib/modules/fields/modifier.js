var methods = {};

// Utils.

methods._addModifier = function(modifier, fieldName, fieldValue) {
  var doc = this;

  var allowedModifiers = ['$set', '$push'];

  if (!_.contains(allowedModifiers, modifier)) {
    return;
  }

  doc._modifiers[modifier] = doc._modifiers[modifier] || {};
  doc._modifiers[modifier][fieldName] = fieldValue;
};

methods._getModifiers = function() {
  var doc = this;

  return doc._modifiers;
};

methods._clearModifiers = function() {
  var doc = this;

  doc._modifiers = {};
};

_.extend(Astro.BaseClass.prototype, methods);
