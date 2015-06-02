Astro.utils.fields = {};

Astro.utils.fields.setValueOfField = function(doc, fieldName, fieldValue, options) {
  options = _.extend({
    cast: true,
    default: true
  }, options);
  var Class = doc.constructor;

  // If value is "undefined" or "null" then try getting its default value.
  if (options.default) {
    fieldValue = Astro.utils.fields.getDefaultValueOfField(
      Class,
      fieldName,
      fieldValue
    );
  }

  // Try casting the value to the proper type.
  if (options.cast) {
    fieldValue = Astro.utils.fields.castValueOfField(
      Class,
      fieldName,
      fieldValue
    );
  }

  // Just set value if the filed name does not containg nesting pattern.
  if (fieldName.indexOf('.') === -1) {
    doc[fieldName] = fieldValue;
    return;
  }

  // First split the field name by the "." sign.
  var segments = fieldName.split('.');

  // Prepare variable for storing value.
  var value = doc;
  _.every(segments, function(segment, index) {
    if (index === segments.length - 1) {
      return false;
    } else {
      // We can break the loop if the current value is not object.
      if (!_.isObject(value)) {
        return false;
      }

      // Get next nested property until we reach one before the last.
      value = value[segment];

      return true;
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

Astro.utils.fields.setValuesOfAllFields = function(doc, fieldsValues, options) {
  var Class = doc.constructor;

  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.utils.fields.setValueOfField(
      doc,
      fieldName,
      fieldsValues[fieldName],
      options
    );
  });
};

Astro.utils.fields.getDefinitionOfField = function(Class, fieldName) {
  // If there is no parent class, then we only look for a definition in this
  // class only.
  if (!Class.getParent()) {
    return Class.getField(fieldName);
  }

  // Find field definition for the "fieldName" in this and parent classes.
  return Astro.utils.class.findInClass(Class, function(Class) {
    return Class.getField(fieldName);
  });
};

Astro.utils.fields.getDefaultValueOfField = function(Class, fieldName, fieldValue) {
  if (!_.isUndefined(fieldValue) && !_.isNull(fieldValue)) {
    return fieldValue;
  }

  // Look for a field's definition.
  var fieldDefinition = Astro.utils.fields.getDefinitionOfField(
    Class,
    fieldName
  );

  // We look for the default value only if there is a field definition.
  if (fieldDefinition) {
    return fieldDefinition.default;
  }

  return null;
};

Astro.utils.fields.getValueOfField = function(doc, fieldName, options) {
  options = _.extend({
    cast: true,
    default: true
  }, options);
  var Class = doc.constructor;

  // Prepare variable for stroing a value to return.
  var fieldValue;

  // Just return value if the filed name does not containg nesting pattern.
  if (fieldName.indexOf('.') === -1) {
    fieldValue = doc[fieldName];
  } else {
    // First split the field name by the "." sign.
    var segments = fieldName.split('.');

    fieldValue = doc;
    _.every(segments, function(segment) {
      // We can break the loop if the current value is not object.
      if (!_.isObject(fieldValue)) {
        return false;
      }

      // Get next nested property until we reach the last one.
      fieldValue = fieldValue[segment];

      return true;
    });
  }

  // If value is "undefined" or "null" then try getting its default value.
  if (options.default) {
    fieldValue = Astro.utils.fields.getDefaultValueOfField(
      Class,
      fieldName,
      fieldValue
    );
  }

  // Try casting the value to the proper type.
  if (options.cast) {
    fieldValue = Astro.utils.fields.castValueOfField(
      Class,
      fieldName,
      fieldValue
    );
  }

  return fieldValue;
};

Astro.utils.fields.getValuesOfAllFields = function(doc, options) {
  var values = {};
  var Class = doc.constructor;

  var fieldsNames = Astro.utils.fields.getNamesOfAllFields(Class);

  _.each(fieldsNames, function(fieldName) {
    var value = Astro.utils.fields.getValueOfField(doc, fieldName, options);
    if (!_.isUndefined(value)) {
      values[fieldName] = value;
    }
  });

  return values;
};

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

Astro.utils.fields.collectNamesOfNestedFields = function(doc, pattern) {
  // Pattern is not valid if it does not containg the "$" sign.
  if (pattern.indexOf('.$') === -1) {
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

Astro.utils.fields.getNamesOfAllFields = function(Class) {
  // If there is no parent class, then we only look for a fields names in this
  // class only.
  if (!Class.getParent()) {
    return _.keys(Class.getFields());
  }

  // Get list of all fields defined in this and parent classes.
  var fieldsNames = [];
  Astro.utils.class.eachClass(Class, function(Class) {
    fieldsNames = fieldsNames.concat(_.keys(Class.getFields()));
  });
  return _.uniq(fieldsNames);
};
