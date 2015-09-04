var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._getOne = function(fieldName, options) {
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
  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedField, nestedFieldName, Class, field, index) {
      fieldValue = nestedField[nestedFieldName];

      if (field) {
        if (options.cast) {
          // Try casting the value to the proper type.
          fieldValue = field.cast(fieldValue);
        } else {
          // Otherwise get a plain value.
          fieldValue = field.plain(fieldValue);
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

proto._getMany = function(fieldNames, options) {
  var doc = this;
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var value = doc._getOne(fieldName, options);
    values[fieldName] = value;
  });

  return values;
};

proto._getAll = function(options) {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc._getMany(Class.getFieldsNames(), options);
};

// Public.

proto.get = function(/* arguments */) {
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
