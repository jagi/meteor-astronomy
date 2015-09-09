var proto = Astro.BaseClass.prototype;

proto.getModified = function(old) {
  old = old || false;
  var doc = this;
  var Class = doc.constructor;

  var modified = {};

  var fieldsNames = Class.getFieldsNames();
  _.each(fieldsNames, function(fieldName) {
    // If a value differs from the value in the "_original" object then it means
    // that fields was modified from the last save.
    if (!EJSON.equals(doc._original[fieldName], doc[fieldName])) {
      // Take a value before or after modification.
      if (old) {
        fieldValue = doc._original[fieldName];
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
