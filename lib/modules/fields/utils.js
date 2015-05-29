Astro.utils.cast = function(type, value) {
  // We only cast value if it's not null or undefined and the type is defined.
  if (type && !_.isUndefined(value) && !_.isNull(value)) {
    value = Astro.types[type](value);
  }

  return value;
};

Astro.utils.class = {};

Astro.utils.class.getDefinitionOfField = function(Class, fieldName) {
  // Find field definition for the "fieldName" in this and parent classes.
  var fieldDefinition = Astro.utils.findInClass(Class, function(Class) {
    return Class.getField(fieldName);
  });

  return fieldDefinition;
};

Astro.utils.class.getDefaultValueOfField = function(Class, fieldName) {
  // Look for a field's definition.
  var fieldDefinition = Astro.utils.class.getDefinitionOfField(Class, fieldName);

  // We look for the default value only if there is field definition.
  if (fieldDefinition && fieldDefinition.default) {
    return fieldDefinition.default;
  }

  return null;
};

Astro.utils.class.castValueOfField = function(Class, fieldName, fieldValue) {
  var fieldDefinition = Astro.utils.class.getDefinitionOfField(Class, fieldName);

  if (fieldDefinition) {
    return Astro.utils.cast(fieldDefinition.type, fieldValue);
  }

  return fieldValue;
};

Astro.utils.class.getNamesOfAllFields = function(Class) {
  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];

  Astro.utils.eachClass(Class, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });

  return _.uniq(fieldsNames);
};

////////////////////////////////////////////////////////////////////////////////

Astro.utils.instance = {};

Astro.utils.instance.getValueOfField = function(doc, fieldName) {
  var Class = doc.constructor;

  // First try spliting field name by "." sign to check whether it contains
  // nested properties.
  var nestedProperties = fieldName.split('.');

  // Prepare variable for storing value.
  var value = doc;
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

  return value;
};

////////////////////////////////////////////////////////////////////////////////

Astro.utils.getAllFieldsNames = function(doc) {
  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];

  Astro.utils.eachClass(doc.constructor, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });

  return _.uniq(fieldsNames);
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
