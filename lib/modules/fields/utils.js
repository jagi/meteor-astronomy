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
      value = Astro.utils.types.castValue(value, fieldDefinition);
    }

    return value;
  },

  getPlainValue: function(Class, fieldName, value) {
    var self = this;

    var fieldDefinition = self.getDefinition(Class, fieldName);

    if (fieldDefinition) {
      value = Astro.utils.types.getPlainValue(value, fieldDefinition);
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

  resolvePattern: function(doc, pattern, callback) {
    var self = this;
    var Class = doc.constructor;
    var values = Astro.config.supportLegacyBrowsers ? doc : doc._values;

    // First split the pattern by the "." sign.
    var segments = pattern.split('.');
    var lastIndex = segments.length - 1;

    // Recursive function for setting value of the nested field.
    var next = function(object, segmentIndex) {
      // Get a segment under the given index.
      var segment = segments[segmentIndex];

      // We don't support the "$" segment here. If you want to set or get
      // multiple fields in (from) the array, you have to use the
      // "getFieldsNamesFromPattern" function and then call the "resolvePattern"
      // function on each field.
      if (segment === '$') {
        return;
      }

      // Compose pattern from the segments up to the current one.
      var nextPattern = segments.slice(0, segmentIndex + 1).join('.');

      // Check if there is a field definition for the given segment. We do this
      // check only for the first segments. Any subobject can have structure,
      // types that don't have to be defined.
      if (segmentIndex === 0) {
        var fieldDefinition = self.getDefinition(Class, segment);
        // If there is no field definition for the first segment, then we stop
        // execution.
        if (!fieldDefinition) {
          return;
        }
      }

      // Set the value, if we reached a one before the last segment.
      if (segmentIndex === lastIndex) {
        callback(object, segment, nextPattern);
      } else {
        // Check one more time if a value of the current segment is object, so
        // we can get deeper.
        if (_.isObject(object[segment])) {
          next(object[segment], segmentIndex + 1);
        } else {
          return;
        }
      }
    };

    // Set the value on the field(s) using recursion.
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

    // Get a value.
    var value = doc[fieldName];

    // If value is empty and the "default" option was set...
    if (_.isUndefined(value) && options.default) {
      // ... then try getting a default value.
      value = self.getDefaultValue(Class, fieldName);
    } else if (options.cast) {
      // Try casting the value to the proper type.
      value = self.castValue(Class, fieldName, value);
    }

    // Set the given value again on the document.
    doc[fieldName] = value;

    // Setting the "plain" flag will get a plain data from the field.
    if (options.plain) {
      value = self.getPlainValue(Class, fieldName, value);
    }

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

    // If value is empty and the "default" option was set...
    if (_.isUndefined(value) && options.default) {
      // ... then try getting a default value.
      value = self.getDefaultValue(Class, fieldName);
    } else if (options.cast) {
      // Try casting the value to the proper type.
      value = self.castValue(Class, fieldName, value);
    }

    // Set the given value on the document.
    doc[fieldName] = value;
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
