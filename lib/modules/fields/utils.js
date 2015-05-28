Astro.utils.cast = function(type, value) {
  // We only cast value if it's not null or undefined and the type is defined.
  if (type && !_.isUndefined(value) && !_.isNull(value)) {
    value = Astro.types[type](value);
  }

  return value;
};

Astro.utils.getAllFieldsNames = function(doc) {
  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];

  Astro.utils.eachClass(doc.constructor, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });

  return _.uniq(fieldsNames);
};

Astro.utils.getFieldValue = function(doc, fieldName) {
  var self = this;

  // First try spliting field name by "." sign to check whether it contains
  // nested properties.
  var nestedProperties = fieldName.split('.');

  // Look for a field's definition.
  var fieldDefinition = Astro.utils.getFieldDefinition(doc, fieldName);

  // If the field's definition is not present then we just return "undefined".
  // if (!fieldDefinition) {
  //   return;
  // }

  // Prepare variable for storing value.
  var value = doc._values;
  _.every(nestedProperties, function(nestedProperty) {
    if (nestedProperty === '$') {
      return false;
    } else {
      // Get the next nested property until we reach the last one or the actual
      // value is "undefined".
      value = value[nestedProperty];

      return !_.isUndefined(value);
    }
  });

  // If value is not present in the "_values" objects then we have to look for
  // default value in the field's definition. We have to use the "EJSON.clone"
  // method to make sure that the value being set is a copy of default value
  // and not a reference.
  if (_.isUndefined(value)) {
    if (fieldDefinition) {
      value = EJSON.clone(fieldDefinition.default);
    } else {
      value = null;
    }
  }

  // At the same time, we can set value for that field in the "_values" object
  // so that getting doc value in the future won't required checking its
  // default value.
  // doc._values[fieldName] = value;

  return value;
};

Astro.utils.getAllFieldsValues = function(doc) {
  var values = {};
  var fieldsNames = Astro.utils.getAllFieldsNames(doc);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.utils.getFieldValue(doc, fieldName);
    if (!_.isUndefined(value)) {
      values[fieldName] = value;
    }
  });

  return values;
};

Astro.utils.setFieldValue = function(doc, fieldName, fieldValue) {
  var self = this;

  // First try spliting field name by "." sign to check whether it contains
  // nested properties.
  var nestedProperties = fieldName.split('.');

  // Look for a field's definition.
  var fieldDefinition = Astro.utils.getFieldDefinition(doc, fieldName);

  // If the field's definition is not present then we just return "undefined".
  // if (!fieldDefinition) {
  //   return false;
  // }

  // Prepare variable for storing value.
  var value = doc._values;
  _.every(nestedProperties, function(nestedProperty, index) {
    if (index === nestedProperties.length - 1) {
      return false;
    } else if (nestedProperty === '$') {
      return false;
    } else {
      // Get the next nested property until we reach the last one or the actual
      // value is "undefined".
      value = value[nestedProperty];

      return !_.isUndefined(value);
    }
  });

  if (_.isObject(value)) {
    value[_.last(nestedProperties)] = fieldValue;
  }
  console.log(value);

  // The value being set has to be casted on the type defined in the schema.
  // fieldValue = Astro.utils.cast(fieldDefinition.type, fieldValue);

  // Then we just set a new value.
  doc._values[fieldName] = fieldValue;

  return true;
};

Astro.utils.getFieldDefinition = function(doc, fieldName) {
  // Find field definition for the "fieldName" in this and parent classes.
  var fieldDefinition = Astro.utils.findInClass(
    doc.constructor, function(Class) {
      return Class.getField(fieldName);
    }
  );

  return fieldDefinition;
};
