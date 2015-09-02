var methods = {};

// Overloaded functions.

methods._getOne = function(fieldName, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Trigger the "beforeGet" event handlers.
  event = new Astro.Event('beforeGet', {
    fieldName: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Set default options of the function. By default, we cast value being get
  // and get default value is none had been provided.
  options = _.extend({
    cast: true
  }, options);

  var fieldValue;
  doc._traverseNestedFields(
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
          if (options.cast) {
            // Try casting the value to the proper type.
            fieldValue = field.cast(fieldValue);
          } else {
            // Otherwise get a plain value.
            fieldValue = field.plain(fieldValue);
          }
        }
      }

      // After casting value, set the casted value back into the field.
      nestedField[nestedFieldName] = fieldValue;
    }
  );

  // Trigger the "afterGet" event handlers.
  event = new Astro.Event('afterGet', {
    fieldName: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  return fieldValue;
};

methods._getMany = function(fieldNames, options) {
  var doc = this;
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var value = doc._getOne(fieldName, options);
    values[fieldName] = value;
  });

  return values;
};

methods._getAll = function(options) {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc._getMany(Class.getFieldsNames(), options);
};

// Public.

methods.get = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 0) {
    return doc._getAll();
  } else if (arguments.length === 1) {
    if (_.isArray(arguments[0])) {
      return doc._getMany(arguments[0]);
    } else if (_.isString(arguments[0])) {
      return doc._getOne(arguments[0]);
    }
  }
};

_.extend(Astro.BaseClass.prototype, methods);
