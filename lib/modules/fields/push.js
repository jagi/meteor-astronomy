var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._pushOne = function(fieldName, pushedValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;
  var plainPushedValue;

  // Don't allow setting undefined value.
  if (_.isUndefined(pushedValue)) {
    return;
  }

  // Trigger the "beforeChange" event handlers.
  event = new Astro.Event('beforeChange', {
    fieldName: fieldName,
    pushedValue: pushedValue
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Trigger the "beforePush" event handlers.
  event = new Astro.Event('beforePush', {
    fieldName: fieldName,
    pushedValue: pushedValue
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

  // An indicator for detecting whether a change of a value was necessary.
  var changed = false;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      // If we try to push element not into the array, then we stop execution.
      if (!_.isArray(nestedDoc[nestedFieldName])) {
        return;
      }

      if (field) {
        if (options.cast) {
          // Try casting the value to the proper type.
          pushedValue = field.cast(pushedValue);
        }

        // Get a plain value of a field for a modifier.
        plainPushedValue = field.plain(EJSON.clone(pushedValue));
      } else if (Class) {
        Astro.errors.warn(
          'fields.not_defined_field',
          nestedFieldName,
          Class.getName()
        );
        return;
      }

      // Set the given value on the document.
      nestedDoc[nestedFieldName].push(pushedValue);

      // Add modifier.
      if (options.modifier) {
        if (_.isUndefined(plainPushedValue)) {
          plainPushedValue = EJSON.clone(pushedValue);
        }
        if (nestedDoc instanceof Astro.BaseClass) {
          nestedDoc._addModifier('$push', nestedFieldName, plainPushedValue);
        } else {
          doc._addModifier('$push', fieldName, plainPushedValue);
        }
      }
    }
  );

  // If a value change did not take place, then we stop here and the following
  // events will not be triggered.
  if (!changed) {
    return;
  }

  // Trigger the "afterPush" event handlers.
  event = new Astro.Event('afterPush', {
    fieldName: fieldName,
    pushedValue: pushedValue
  });
  event.target = doc;
  Class.emitEvent(event);

  // Trigger the "afterChange" event handlers.
  event = new Astro.Event('afterChange', {
    fieldName: fieldName,
    pushedValue: pushedValue
  });
  event.target = doc;
  Class.emitEvent(event);
};

proto._pushMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    doc._pushOne(fieldName, fieldValue, options);
  });
};

// Public.

proto.push = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    doc._pushMany(args[0]);
  } else if (args.length === 2) {
    doc._pushOne(args[0], args[1]);
  }
};
