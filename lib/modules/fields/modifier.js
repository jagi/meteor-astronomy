var methods = {};

// Utils.

methods._getModifier = function() {
  var doc = this;

  return doc._modifier;
};

methods._resetModifier = function() {
  var doc = this;

  doc._modifier = {
    $set: {},
    $push: {},
    $inc: {}
  };
};

_.extend(Astro.BaseClass.prototype, methods);
