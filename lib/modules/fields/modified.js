var proto = Astro.BaseClass.prototype;

proto.getModified = function(old) {
  old = old || false;
  var doc = this;
  var Class = doc.constructor;

  var modified = {};

  var fields = Class.getFields();
  _.each(fields, function(field, fieldName) {
    if (field.transient) {
      return;
    }
    // If a value differs from the value in the "_original" object then it means
    // that fields was modified from the last save.
    if (!EJSON.equals(doc._original[fieldName], doc[fieldName])) {
      // Take a value before or after modification.
      var fieldValue;
      if (old) {
        fieldValue = doc._original[fieldName];
      } else {
        fieldValue = doc[fieldName];
      }

      modified[fieldName] = fieldValue;
    }
  });

  return modified;
};

proto.isModified = function(old) {
  var doc = this;

  // Get a modifier.
  var modifier = doc._getModifiers();
  // If there are any modifiers, then it means that document was modified.
  return _.size(modifier) > 0;
};
