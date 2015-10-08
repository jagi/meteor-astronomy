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
    transient: true
  }, options);

  // An indicator for breaking the "get" method if needed (i.e. trying to get a
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
      }
    }
  );

  // If the operation was stopped, then we do not want to execute the "afterGet"
  // event.
  if (stop) {
    return;
  }

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
    // Do not get "undefined" values.
    if (_.isUndefined(value)) {
      return;
    }
    values[fieldName] = value;
  });

  return values;
};

// Public.

proto.get = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 0) {
    return doc;
  } else if (arguments.length === 1) {
    if (_.isArray(arguments[0])) {
      return doc._getMany(arguments[0]);
    } else if (_.isString(arguments[0])) {
      return doc._getOne(arguments[0]);
    }
  }
};
