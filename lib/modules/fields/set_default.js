var proto = Astro.BaseClass.prototype;

proto._setDefault = function(fieldName) {
  var doc = this;
  var Class = doc.constructor;

  // Check if a field definition exists.
  var field = Class.getField(fieldName);

  // If there is no field definition, then we can't get a default value.
  if (!field) {
    return;
  }

  // Get a default value, cast to the proper type and assing the field.
  if (fieldName === 'classArray') console.log('BEFORE', doc[fieldName]);
  doc[fieldName] = field.getDefault();
  if (fieldName === 'classArray') console.log('AFTER', doc[fieldName]);
};
