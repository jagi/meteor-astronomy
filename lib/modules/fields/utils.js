Astro.utils.fields = {
  isPattern: function(name) {
    return name.indexOf('.') !== -1;
  },

  getDefinition: function(Class, fieldName) {
    // If there is no parent class, then we look for a definition in this class
    // only.
    if (!Class.getParent()) {
      return Class.schema.fields[fieldName];
    }

    // Find field definition for the "fieldName" in this and parent
    // classes.
    return Astro.utils.class.findInClass(Class, function(Class) {
      return Class.schema.fields[fieldName];
    });
  },

  getDefaultValue: function(Class, fieldName) {
    var self = this;

    // Prepare variable for storing a default value.
    var value;

    // Look for a field's definition.
    var fieldDefinition = self.getDefinition(Class, fieldName);

    // We look for the default value only if there is a field definition.
    if (fieldDefinition) {
      value = EJSON.clone(fieldDefinition.default);
    }

    return value;
  },

  castValue: function(Class, fieldName, value) {
    var self = this;

    var fieldDefinition = self.getDefinition(Class, fieldName);

    if (fieldDefinition) {
      // We just return given value if it's null or undefined.
      if (_.isUndefined(value) || _.isNull(value)) {
        return value;
      }

      // We just return given value, if the field type haven't been provided.
      if (!fieldDefinition.type) {
        return value;
      }

      return fieldDefinition.type.cast(value, fieldDefinition);
    }

    return value;
  },

  getPlainValue: function(Class, fieldName, value) {
    var self = this;

    var fieldDefinition = self.getDefinition(Class, fieldName);

    if (fieldDefinition) {
      // We just return given value if it's null or undefined.
      if (_.isUndefined(value) || _.isNull(value)) {
        return value;
      }

      // We just return given value, if the field type haven't been provided.
      if (!fieldDefinition.type) {
        return value;
      }

      return fieldDefinition.type.plain(value, fieldDefinition);
    }

    return value;
  },

  getAllFieldsNames: function(Class) {
    // If there is no parent class, then we only look for a fields names in this
    // class only.
    if (!Class.getParent()) {
      return Class.schema.fieldsNames;
    }

    // Get list of all fields defined in this and parent classes.
    var fieldsNames = [];
    Astro.utils.class.eachClass(Class, function(Class) {
      fieldsNames = fieldsNames.concat(Class.schema.fieldsNames);
    });
    return _.uniq(fieldsNames);
  },

  getFieldsNamesFromPattern: function(doc, pattern) {
    var values = Astro.config.supportLegacyBrowsers ? doc : doc._values;

    // If it isn't nested pattern so it has to be regular field name. In that
    // case we just return this field name as an array with a single element.
    if (!this.isPattern(pattern)) {
      return [pattern];
    }

    // Variable for storing fields' names that match the pattern.
    var fieldsNames = [];

    // First split pattern by the "." sign.
    var segments = pattern.split('.');

    // Recursive function for finding fields names.
    var find = function(value, segmentIndex, fieldName) {
      // If we reached the end of a nested data, then we don't try to find the
      // field name.
      if (_.isUndefined(value)) {
        return;
      }

      // Check if we haven't reached the last segment.
      if (segmentIndex < segments.length) {
        var segment = segments[segmentIndex];

        // We reached a segment indicating that we are dealing with array.
        if (segment === '$') {
          // We have to make sure that value is an array, if it's not then we
          // stop looking for this field name.
          if (!_.isArray(value)) {
            return;
          }

          // Recursively look for fields names in the array.
          _.each(value, function(arrayElement, arrayIndex) {
            find(arrayElement, segmentIndex + 1, fieldName + '.' +
              arrayIndex);
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

    find(values, 0, '');

    return fieldsNames;
  },

  traverseNestedFields: function(doc, fieldName, callback) {
    var self = this;
    var Class = doc.constructor;
    var values = Astro.config.supportLegacyBrowsers ? doc : doc._values;

    // Check whether the given field name is pattern.
    if (fieldName.indexOf('.') === -1) {
      // If it's not a pattern, then just invoke callback function.
      callback(doc, fieldName);
      return;
    }

    // Split the nested field name pattern by the "." sign.
    var nestedFieldsNames = fieldName.split('.');
    var lastIndex = nestedFieldsNames.length - 1;

    // Traverse nested fields until reaching the last one from the pattern.
    var next = function(nestedField, nestedFieldIndex) {
      // Get a nested field name under the given index.
      var nestedFieldName = nestedFieldsNames[nestedFieldIndex];

      if (nestedFieldIndex === lastIndex) {
        // Ivoke the callback function, if we reached the last nested field.
        callback(nestedField, nestedFieldName);
      } else {
        // Check if the value of the current nested field is an object, so that
        // we can go deeper.
        if (_.isObject(nestedField[nestedFieldName])) {
          next(nestedField[nestedFieldName], nestedFieldIndex + 1);
        } else {
          return;
        }
      }
    };

    // Start traversing nested fields.
    next(values, 0);
  },

  getAllValues: function(doc, options) {
    var self = this;
    var Class = doc.constructor;

    return self.getValues(
      doc,
      self.getAllFieldsNames(Class),
      options
    );
  },

  getValues: function(doc, fieldNames, options) {
    var self = this;
    var values = {};

    _.each(fieldNames, function(fieldName) {
      values[fieldName] = self.getValue(
        doc,
        fieldName,
        options
      );
    });

    return values;
  },

  getValue: function(doc, fieldName, options) {
    var self = this;
    var Class = doc.constructor;

    // Set default options of the function. By default, we cast value being get
    // and get default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true,
      plain: false
    }, options);

    var value;

    self.traverseNestedFields(
      doc,
      fieldName,
      function(nestedFieldParent, nestedFieldName) {
        value = nestedFieldParent[nestedFieldName];

        // If value is empty and the "default" option was set...
        if (_.isUndefined(value) && options.default) {
          // ... then try getting a default value.
          value = self.getDefaultValue(Class, nestedFieldName);
        } else if (options.cast) {
          // Try casting the value to the proper type.
          value = self.castValue(Class, nestedFieldName, value);
        }

        // Set the given value again on the document.
        nestedFieldParent[nestedFieldName] = value;

        // Setting the "plain" flag will get a plain data from the field.
        if (options.plain) {
          value = self.getPlainValue(Class, nestedFieldName, value);
        }
      }
    );

    return value;
  },

  setAllValues: function(doc, values, options) {
    var self = this;
    var Class = doc.constructor;

    var names = self.getAllFieldsNames(Class);

    // Extend the "values" object with empty fields that had not been provided.
    _.each(names, function(name) {
      if (!_.has(values, name)) {
        values[name] = undefined;
      }
    });

    self.setValues(doc, values, options);
  },

  setValues: function(doc, values, options) {
    var self = this;

    _.each(values, function(value, name) {
      self.setValue(doc, name, value, options);
    });
  },

  setValue: function(doc, fieldName, value, options) {
    var self = this;
    var Class = doc.constructor;

    // Set default options of the function. By default, we cast value being set
    // and set default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true
    }, options);

    self.traverseNestedFields(
      doc,
      fieldName,
      function(nestedFieldParent, nestedFieldName) {
        // If value is empty and the "default" option was set...
        if (_.isUndefined(value) && options.default) {
          // ... then try getting a default value.
          value = self.getDefaultValue(Class, nestedFieldName);
        } else if (options.cast) {
          // Try casting the value to the proper type.
          value = self.castValue(Class, nestedFieldName, value);
        }

        // Set the given value on the document.
        nestedFieldParent[nestedFieldName] = value;
      }
    );
  },

  getModifiedValues: function(doc, old, options) {
    old = old || false;
    var self = this;
    var Class = doc.constructor;

    // Set default options of the function. By default, we cast value being get
    // and get default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true,
      plain: false
    }, options);

    var modified = {};

    // Get the current values of all fields but "_id" (we can't change id).
    var fieldsValues = _.omit(self.getAllValues(doc), '_id');

    _.each(fieldsValues, function(fieldValue, fieldName) {
      // If a value differs from the value in the "_original" object then it means
      // that fields was modified from the last save.
      if (!EJSON.equals(doc._original[fieldName], fieldValue)) {
        // Decide if we want to take new or old value.
        var value;
        if (old) {
          value = doc._original[fieldName];
        } else {
          value = fieldValue;
        }

        // Setting the "plain" flag will get a plain data from the field.
        if (options.plain) {
          value = self.getPlainValue(Class, fieldName, value);
        }

        modified[fieldName] = value;
      }
    });

    return modified;
  }
};
