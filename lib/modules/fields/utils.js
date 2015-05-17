Astro.Utils.cast = function(type, value) {
  // We only cast value if it's not null or undefined and the type is defined.
  if (type && !_.isUndefined(value) && !_.isNull(value)) {
    value = Types[type](value);
  }

  return value;
};

Astro.Utils.getAllFieldsNames = function(doc) {
  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];

  Astro.Utils.eachClass(doc.constructor, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });

  return _.uniq(fieldsNames);
};

Astro.Utils.getFieldValue = function(doc, fieldName) {
  var value;

  // Look for a field's definition.
  var fieldDefinition = Astro.Utils.getFieldDefinition(doc, fieldName);

  // If the field's definition is not present then we just return "undefined".
  if (!fieldDefinition) {
    return;
  }

  // Look for value in the "_values" object.
  if (_.has(doc._values, fieldName)) {

    value = doc._values[fieldName];

  } else {

    // If value is not present in the "_values" objects then we have to look for
    // default value in the field's definition. We have to use the "EJSON.clone"
    // method to make sure that the value being set is a copy of default value
    // and not a reference.
    value = EJSON.clone(fieldDefinition.default);

    // At the same time, we can set value for that field in the "_values" object
    // so that getting doc value in the future won't required checking its
    // default value.
    doc._values[fieldName] = value;
  }

  return value;
};

Astro.Utils.getAllFieldsValues = function(doc) {
  var values = {};
  var fieldsNames = Astro.Utils.getAllFieldsNames(doc);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.Utils.getFieldValue(doc, fieldName);
    if (!_.isUndefined(value)) {
      values[fieldName] = value;
    }
  });

  return values;
};

Astro.Utils.setFieldValue = function(doc, fieldName, fieldValue) {
  // Look for a field's definition.
  var fieldDefinition = Astro.Utils.getFieldDefinition(doc, fieldName);

  // If the field's definition is not present then we just return "undefined".
  if (!fieldDefinition) {
    return false;
  }

  // The value being set has to be casted on the type defined in the schema.
  fieldValue = Astro.Utils.cast(fieldDefinition.type, fieldValue);

  // Then we just set a new value.
  doc._values[fieldName] = fieldValue;

  return true;
};

Astro.Utils.getFieldDefinition = function(doc, fieldName) {
  // Find field definition for the "fieldName" in this and parent classes.
  var fieldDefinition = Astro.Utils.findInClass(
    doc.constructor, function(Class) {
      return Class.getField(fieldName);
    }
  );

  return fieldDefinition;
};
