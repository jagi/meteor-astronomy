var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._rawOne = function(fieldName, options) {
  var doc = this;
  var Class = doc.constructor;

  // Set default options of the function. By default, we cast value being get
  // and get default value is none had been provided.
  options = _.extend({
    transient: true
  }, options);

  // An indicator for stopping the "raw" method if needed (i.e. trying to get a
  // transient field when the transient option is set to false).
  var stop = false;

  // Field value to be returned.
  var fieldValue;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedField, nestedFieldName, Class, field, index) {
      if (_.isUndefined(index)) {
        fieldValue = nestedField[nestedFieldName];
      } else {
        fieldValue = nestedField[nestedFieldName][index];
      }

      if (field) {
        // Do not get a field if it's transient and the "transient" option was
        // set to false.
        if (!options.transient && field.transient) {
          stop = true;
          return;
        }

        if (field instanceof Astro.fields.object) {
          if (fieldValue instanceof Astro.BaseClass) {
            fieldValue = fieldValue._rawAll(options);
          }
        } else if (field instanceof Astro.fields.array) {
          if (_.isArray(fieldValue)) {
            var values = fieldValue;
            fieldValue = [];
            _.each(values, function(value, i) {
              if (value instanceof Astro.BaseClass) {
                fieldValue[i] = value._rawAll(options);
              } else {
                fieldValue[i] = EJSON.clone(value);
              }
            });
          } else {
            if (fieldValue instanceof Astro.BaseClass) {
              fieldValue = fieldValue._rawAll(options);
            }
          }
        } else {
          // Otherwise get a plain value.
          fieldValue = field.plain(fieldValue);
        }
      }
    }
  );

  // If the operation was stopped, then we do not return anything.
  if (stop) {
    return;
  }

  return fieldValue;
};

proto._rawMany = function(fieldNames, options) {
  var doc = this;
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var value = doc._rawOne(fieldName, options);
    // Do not get "undefined" values.
    if (_.isUndefined(value)) {
      return;
    }
    values[fieldName] = value;
  });

  return values;
};

proto._rawAll = function(options) {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc._rawMany(Class.getFieldsNames(), options);
};

// Public.

proto.raw = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 0) {
    return doc._rawAll();
  } else if (arguments.length === 1) {
    if (_.isArray(arguments[0])) {
      return doc._rawMany(arguments[0]);
    } else if (_.isString(arguments[0])) {
      return doc._rawOne(arguments[0]);
    }
  }
};
