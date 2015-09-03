var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._setOne = function(fieldName, fieldValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;
  var plainFieldValue;

  // Don't allow setting undefined value.
  if (_.isUndefined(fieldValue)) {
    return;
  }

  // Deny changing the "_id" property.
  if (fieldName === '_id' && doc._id) {
    return;
  }

  // Trigger the "beforeSet" event handlers.
  event = new Astro.Event('beforeSet', {
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
    modifier: true
  }, options);

  Astro.utils.fields.traverseNestedFields(
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
          if (field instanceof Astro.EmbedOneField) {
            if (!_.isObject(fieldValue)) {
              return;
            }
          } else if (field instanceof Astro.EmbedManyField) {
            if (!_.isArray(fieldValue)) {
              return;
            }
          }

          if (options.cast) {
            // Try casting the value to the proper type.
            fieldValue = field.cast(fieldValue);
          }

          // Get a plain value of a field for a modifier.
          plainFieldValue = field.plain(EJSON.clone(fieldValue));
        } else {
          Astro.errors.warn(
            'fields.not_defined_field',
            nestedFieldName,
            Class.getName()
          );
        }
      }

      // Set the given value on the document.
      nestedDoc[nestedFieldName] = fieldValue;

      // Add modifier.
      if (options.modifier) {
        doc._addModifier('$set', fieldName, plainFieldValue);
      }
    }
  );

  // Trigger the "afterSet" event handlers.
  event = new Astro.Event('afterSet', {
    fieldName: fieldName,
    fieldValue: fieldValue
  });
  event.target = doc;
  Class.emitEvent(event);
};

proto._setMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    doc._setOne(fieldName, fieldValue, options);
  });
};

// Public.

proto.set = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 1 && _.isObject(arguments[0])) {
    doc._setMany(arguments[0]);
  } else if (arguments.length === 2 && _.isString(arguments[0])) {
    doc._setOne(arguments[0], arguments[1]);
  }
};
