var methods = {};

// Overloaded functions.

methods._pushOne = function(fieldName, fieldValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Don't allow setting undefined value.
  if (_.isUndefined(fieldValue)) {
    return;
  }

  // Trigger the "beforePush" event handlers.
  event = new Astro.Event('beforePush', {
    fieldName: fieldName,
    fieldValue: fieldValue
  });
  event.target = doc;
  Class.emitEvent(event);

  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Set default options of the function. By default, we cast value being set.
  options = _.extend({
    cast: true,
    modifier: true,
  }, options);

  doc._traverseNestedFields(
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
          if (options.cast) {
            // Try casting the value to the proper type.
            fieldValue = field.cast(fieldValue);
          }
        } else {
          Astro.errors.warn(
            'fields.not_defined_field',
            nestedFieldName,
            Class.getName()
          );
        }
      }

      // If we try to push element not into array, then we stop execution.
      if (!_.isArray(nestedDoc[nestedFieldName])) {
        return;
      }

      // Set the given value on the document.
      nestedDoc[nestedFieldName].push(fieldValue);

      // Add modifier.
      if (options.modifier) {
        if (nestedDoc instanceof Astro.BaseClass) {
          nestedDoc._addModifier('$push', nestedFieldName, fieldValue);
        } else {
          doc._addModifier('$push', fieldName, fieldValue);
        }
      }
    }
  );

  // Trigger the "afterPush" event handlers.
  event = new Astro.Event('afterPush', {
    fieldName: fieldName,
    fieldValue: fieldValue
  });
  event.target = doc;
  Class.emitEvent(event);
};

methods._pushArray = function(fieldName, fieldValues, options) {
  var doc = this;

  _.each(fieldValues, function(fieldValue) {
    doc._pushOne(fieldName, fieldValue, options);
  });
};

methods._pushMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    if (_.isArray(fieldValue)) {
      doc._pushArray(fieldName, fieldValue, options);
    } else {
      doc._pushOne(fieldName, fieldValue, options);
    }
  });
};

// Public.

methods.push = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    doc._pushMany(args[0]);
  } else if (args.length === 2 && _.isString(args[0])) {
    if (_.isArray(args[1])) {
      doc._pushArray(args[0], args[1]);
    } else {
      doc._pushOne(args[0], args[1]);
    }
  }
};

_.extend(Astro.BaseClass.prototype, methods);
