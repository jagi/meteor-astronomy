Astro.utils.fields = {};

Astro.utils.fields.castValueOfField = function(Class, fieldName, fieldValue) {
  var fieldDefinition = Astro.utils.fields.getDefinitionOfField(
    Class,
    fieldName
  );

  if (fieldDefinition) {
    return Astro.utils.types.castValue(fieldDefinition.type, fieldValue);
  }

  return fieldValue;
};

Astro.utils.fields.getDefinitionOfField = function(Class, fieldName) {
  // Find field definition for the "fieldName" in this and parent classes.
  var fieldDefinition = Astro.utils.class.findInClass(Class, function(Class) {
    return Class.getField(fieldName);
  });

  return fieldDefinition;
};

Astro.utils.fields.getDefaultValueOfField = function(Class, fieldName) {
  // Look for a field's definition.
  var fieldDefinition = Astro.utils.fields.getDefinitionOfField(
    Class,
    fieldName
  );

  // We look for the default value only if there is field definition.
  if (fieldDefinition && fieldDefinition.default) {
    return fieldDefinition.default;
  }

  return null;
};

Astro.utils.fields.getNamesOfAllFields = function(Class) {
  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];

  Astro.utils.class.eachClass(Class, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });

  return _.uniq(fieldsNames);
};

Astro.utils.fields.collectNamesOfNestedFields = function(doc, pattern) {
  // Pattern is not valid if it does not containg the "$" sign.
  if (pattern.indexOf('$') === -1) {
    return;
  }

  // Variable for storing fields' names that match the pattern.
  var fieldsNames = [];

  // First split pattern by the "." sign.
  var segments = pattern.split('.');

  // Recursive function for finding fields names.
  var find = function(value, segmentIndex, fieldName) {
    // If we reached the end of a nested data, then we don't try to find this
    // field name.
    if (_.isUndefined(value)) {
      return;
    }

    // Check if we haven't reached the last segment.
    if (segmentIndex < segments.length) {
      var segment = segments[segmentIndex];

      // We reached a segment indicating that we are dealing with array.
      if (segment === '$') {
        // We have to make sure that value is an array, if it's not then we stop
        // looking for this field name.
        if (!_.isArray(value)) {
          return;
        }

        // Check if there are more "$" signs in the pattern.
        // var hasMore = segments.indexOf('$', segmentIndex + 1) !== -1;
        // if (!hasMore) {
        //   var leftPattern = segments.slice(segmentIndex + 1).join('.');
        // }

        // Recursively look for fields names in the array.
        _.each(value, function(arrayValue, arrayIndex) {
          find(arrayValue, segmentIndex + 1, fieldName + '.' + arrayIndex);
          // if (hasMore) {
          //   find(arrayValue, segmentIndex + 1, fieldName + '.' + arrayIndex);
          // } else {
          //   fieldsNames.push(fieldName.slice(1) + '.' + arrayIndex + '.' + leftPattern);
          // }
        });
      } else {
        // Concatenate segment to compose field name.
        fieldName = fieldName + '.' + segment;
        // Recursively try to compose field name with the next segment.
        find(value[segment], segmentIndex + 1, fieldName);
      }
    } else {
      // If we reached the last segment then we can add composed field name.
      fieldsNames.push(fieldName.slice(1));
    }
  };

  find(doc, 0, '');

  return fieldsNames;
};

Astro.utils.fields.getValueOfField = function(doc, fieldName) {
  var Class = doc.constructor;

  // Prepare variable for stroing a value to return.
  var value;

  // Just return value if the filed name does not containg nesting pattern.
  if (fieldName.indexOf('.') === -1) {
    value = doc[fieldName];
  } else {
    // First split the field name by the "." sign.
    var segments = fieldName.split('.');

    value = doc;
    _.every(segments, function(segment) {
      // Get next nested property until we reach the last one.
      value = value[segment];

      return !_.isUndefined(value);
    });
  }

  // If value is "undefined" then try getting its default value.
  if (_.isUndefined(value)) {
    value = Astro.utils.fields.getDefaultValueOfField(Class, fieldName);
  }

  return value;
};

Astro.utils.fields.getValuesOfAllFields = function(doc) {
  var values = {};
  var Class = doc.constructor;

  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.utils.fields.getValueOfField(doc, fieldName);
    if (!_.isUndefined(value)) {
      values[fieldName] = value;
    }
  });

  return values;
};

Astro.utils.fields.setValueOfField = function(doc, fieldName, fieldValue) {
  // Just set value if the filed name does not containg nesting pattern.
  if (fieldName.indexOf('.') === -1) {
    return doc[fieldName] = fieldValue;
  }

  // First split the field name by the "." sign.
  var segments = fieldName.split('.');

  // Prepare variable for storing value.
  var value = doc;
  _.every(segments, function(segment, index) {
    if (index === segments.length - 1) {
      return false;
    } else {
      // Get next nested property until we reach one before the last.
      value = value[segment];

      return !_.isUndefined(value);
    }
  });

  // We've been getting nested propeties to the one before the last. Thanks to
  // that the penultimate value should be reference to the object that stores
  // the last property. In this step we are setting the last property and thanks
  // to having reference we are setting it on the original object to.
  if (_.isObject(value)) {
    value[_.last(segments)] = fieldValue;
  }
};
