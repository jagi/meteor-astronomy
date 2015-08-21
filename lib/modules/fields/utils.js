Astro.utils.fields = {
  traverseNestedFields: function(doc, fieldName, callback) {
    var self = this;
    var Class = doc.constructor;

    // Check whether the given field name is pattern.
    if (fieldName.indexOf('.') === -1) {
      // If it's not a pattern, then just invoke callback function.
      callback(doc, fieldName);
      return;
    }

    // Split the nested field name pattern by the "." sign.
    var segments = fieldName.split('.');
    var lastIndex = segments.length - 1;

    // Traverse nested fields until reaching the last one from the pattern.
    var next = function(nestedField, segmentIndex) {
      // Get a nested field name under the given index.
      var nestedFieldName = segments[segmentIndex];

      if (segmentIndex === lastIndex) {
        // Ivoke the callback function, if we reached the last nested field.
        callback(nestedField, nestedFieldName);
      } else {
        // Check if the value of the current nested field is an object, so that
        // we can go deeper.
        if (_.isObject(nestedField[nestedFieldName])) {
          var nextNestedField = nestedField[nestedFieldName];
          var nextSegmentIndex = segmentIndex + 1;
          if (nextNestedField instanceof Astro.BaseClass) {
            var remainingFieldName = segments.slice(nextSegmentIndex).join('.');
            self.traverseNestedFields(
              nextNestedField,
              remainingFieldName,
              callback
            );
          } else {
            next(nextNestedField, nextSegmentIndex);
          }
        } else {
          return;
        }
      }
    };

    // Start traversing nested fields.
    next(doc, 0);
  },

  setAllValues: function(doc, fieldsValues, options) {
    var self = this;
    var Class = doc.constructor;

    var fieldsNames = Class.getFieldsNames();

    // Extend the "fieldsValues" object with empty fields that had not been provided.
    _.each(fieldsNames, function(fieldName) {
      if (!_.has(fieldsValues, fieldName)) {
        fieldsValues[fieldName] = undefined;
      }
    });

    self.setValues(doc, fieldsValues, options);
  },

  setValues: function(doc, fieldsValues, options) {
    var self = this;

    _.each(fieldsValues, function(fieldValue, fieldName) {
      self.setValue(doc, fieldName, fieldValue, options);
    });
  },

  setValue: function(doc, fieldName, fieldValue, options) {
    var self = this;

    // Set default options of the function. By default, we cast value being set
    // and set default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true
    }, options);

    self.traverseNestedFields(
      doc,
      fieldName,
      function(nestedDoc, nestedFieldName) {
        var Class;
        if (nestedDoc instanceof Astro.BaseClass) {
          Class = nestedDoc.constructor;
        }

        if (Class) {
          // Check if a field definition exists.
          var field = Class.getField(nestedFieldName);

          if (field) {
            // If value is empty and the "default" option was set...
            if (_.isUndefined(fieldValue) && options.default) {
              // ... then try getting a default value.
              fieldValue = field.getDefault();
            }

            if (options.cast) {
              // Try casting the value to the proper type.
              fieldValue = field.cast(fieldValue);
            }
          } else {
            console.warn(
              'Trying to set the "' + fieldName +
              '" field that does not exist in the "' +
              Class.getName() + '" class schema'
            );
          }
        }

        // Set the given value on the document.
        nestedDoc[nestedFieldName] = fieldValue;
      }
    );
  },

  getAllValues: function(doc, options) {
    var self = this;
    var Class = doc.constructor;

    return self.getValues(doc, Class.getFieldsNames(), options);
  },

  getValues: function(doc, fieldNames, options) {
    var self = this;
    var values = {};

    _.each(fieldNames, function(fieldName) {
      values[fieldName] = self.getValue(doc, fieldName, options);
    });

    return values;
  },

  getValue: function(doc, fieldName, options) {
    var self = this;

    // Set default options of the function. By default, we cast value being get
    // and get default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true
    }, options);

    var fieldValue;

    self.traverseNestedFields(
      doc,
      fieldName,
      function(nestedField, nestedFieldName) {
        var Class;
        if (nestedField instanceof Astro.BaseClass) {
          Class = nestedField.constructor;
        }

        fieldValue = nestedField[nestedFieldName];

        if (Class) {
          // Check if a field definition exists.
          var field = Class.getField(nestedFieldName);

          if (field) {
            // If value is empty and the "default" option was set...
            if (_.isUndefined(fieldValue) && options.default) {
              // ... then try getting a default value.
              fieldValue = field.getDefault();
            }

            if (options.cast) {
              // Try casting the value to the proper type.
              fieldValue = field.cast(fieldValue);
            } else {
              // Otherwise get a plain value.
              fieldValue = field.plain(fieldValue);
            }
          }
        }
      }
    );

    return fieldValue;
  },

  getModifiedValues: function(doc, old, options) {
    old = old || false;
    var self = this;
    var Class = doc.constructor;

    // Set default options of the function. By default, we cast value being get
    // and get default value is none had been provided.
    options = _.extend({
      cast: true,
      default: true
    }, options);

    var modified = {};

    // Get the current values of all fields but "_id" (we can't change id).
    var fieldsValues = _.omit(self.getAllValues(doc), '_id');

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
  }
};
