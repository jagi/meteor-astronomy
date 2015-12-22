var proto = Astro.BaseClass.prototype;

proto.getModified = function(old) {
  old = old || false;
  var doc = this;
  var Class = doc.constructor;

  doc._clearUnnecessaryModifiers();

  if (doc._id && Class.getCollection()) {
    var originalDoc = Class.findOne(doc._id);
  } else {
    var originalDoc = new Class();
  }

  var modified = {};

  var fields = Class.getFields();
  _.each(fields, function(field, fieldName) {
    if (field.transient) {
      return;
    }
    // If a value differs from the value in the original object then it means
    // that fields was modified from the last save.
    if (!EJSON.equals(originalDoc[fieldName], doc[fieldName])) {
      // Take a value before or after modification.
      var fieldValue;
      if (old) {
        fieldValue = originalDoc[fieldName];
      } else {
        fieldValue = doc[fieldName];
      }

      modified[fieldName] = fieldValue;
    }
  });

  return modified;
};

proto.isModified = function() {
  var doc = this;

  // Get a modifier.
  var modifier = doc._getModifiers();
  // If there are any modifiers, then it means that document was modified.
  return _.size(modifier) > 0;
};
