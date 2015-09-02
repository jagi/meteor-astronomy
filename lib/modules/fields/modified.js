var proto = Astro.BaseClass.prototype;

// Utils.

proto._getModifiedValues = function(old, options) {
  old = old || false;
  var doc = this;
  var Class = doc.constructor;

  // Set default options of the function. By default, we cast value being get
  // and get default value is none had been provided.
  options = _.extend({
    cast: true,
    default: true
  }, options);

  var modified = {};

  // Get the current values of all fields but "_id" (we can't change id).
  var fieldsValues = _.omit(doc._getAll(), '_id');

  _.each(fieldsValues, function(fieldValue, fieldName) {
    // If a value differs from the value in the "_original" object then it means
    // that fields was modified from the last save.
    if (!EJSON.equals(doc._original[fieldName], fieldValue)) {
      // Take a value before or after modification.
      if (old) {
        fieldValue = doc._original[fieldName];
      }

      // Get a field definition for the given field name.
      var field = Class.getField(fieldName);
      if (field) {
        if (options.cast) {
          fieldValue = field.cast(fieldValue);
        } else {
          fieldValue = field.plain(fieldValue);
        }
      }

      modified[fieldName] = fieldValue;
    }
  });

  return modified;
};

// Public.

proto.getModified = function(old) {
  var doc = this;

  return doc._getModifiedValues(old);
};
