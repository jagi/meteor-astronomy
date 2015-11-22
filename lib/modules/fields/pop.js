var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._popOne = function(fieldName, popValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;
  var result;

  // Cast the "popValue" argument to a number.
  popValue = Number(popValue);

  // Don not allow the "popValue" value different than -1 and 1.
  if (popValue !== 1 && popValue !== 1) {
    return result;
  }

  // Trigger the "beforeChange" event handlers.
  event = new Astro.Event('beforeChange', {
    fieldName: fieldName,
    operation: 'pop'
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return result;
  }

  // Trigger the "beforePop" event handlers.
  event = new Astro.Event('beforePop', {
    fieldName: fieldName,
    popValue: popValue
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return result;
  }

  // Set default options of the function.
  options = _.extend({
    modifier: true,
    mutable: false
  }, options);

  // An indicator for detecting whether a change of a value was necessary.
  var changed = false;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      // If we try to pop an element not from an array, then we stop execution.
      if (!_.isArray(nestedDoc[nestedFieldName])) {
        return;
      }

      if (field) {
        // Check whether the field is immutable, so we can not update it and
        // should stop execution.
        if (field.immutable && !options.mutable) {
          var currFieldValue;
          if (_.isUndefined(index)) {
            currFieldValue = nestedDoc[nestedFieldName];
          } else {
            currFieldValue = nestedDoc[nestedFieldName][index];
          }
          if (!doc._isNew && !_.isNull(currFieldValue)) {
            return;
          }
        }

        // If the field has the "transient" flag set to true, then we have to
        // modify options and turn off the "modifier" flag.
        if (field.transient) {
          options.modifier = false;
        }
      } else if (Class) {
        Astro.utils.warn(
          'Trying to pop a value from the "' + nestedFieldName + '" field ' +
          'that does not exist in the "' + Class.getName() + '" class'
        );
        return;
      }

      // Add modifier.
      if (options.modifier) {
        if (nestedDoc instanceof Astro.BaseClass) {
          if (_.isUndefined(index)) {
            changed = nestedDoc._addModifier(
              '$pop', nestedFieldName, popValue
            );
          } else {
            changed = nestedDoc._addModifier(
              '$pop', nestedFieldName + '.' + index, popValue
            );
          }
        } else {
          changed = doc._addModifier('$pop', fieldName, popValue);
        }
      } else {
        // If the "modifier" option is not set it means that we just want a
        // given value to be set without checking if it is possible.
        changed = true;
      }

      // If a value change was not possible, then we stop here.
      if (!changed) {
        return;
      }

      // Pop a value from the start or the end of an array.
      if (popValue === 1) {
        result = nestedDoc[nestedFieldName].pop();
      } else {
        result = nestedDoc[nestedFieldName].unshift();
      }
    }
  );

  // If a value change did not take place, then we stop here and the following
  // events will not be triggered.
  if (!changed) {
    return result;
  }

  // Trigger the "afterPop" event handlers.
  event = new Astro.Event('afterPop', {
    fieldName: fieldName,
    popValue: popValue
  });
  event.target = doc;
  Class.emitEvent(event);

  // Trigger the "afterChange" event handlers.
  event = new Astro.Event('afterChange', {
    fieldName: fieldName,
    operation: 'pop'
  });
  event.target = doc;
  Class.emitEvent(event);

  return result;
};

proto._popMany = function(popValues, options) {
  var doc = this;
  var result = {};

  // Set multiple fields.
  _.each(popValues, function(popValue, fieldName) {
    result[fieldName] = doc._popOne(fieldName, popValue, options);
  });

  return result;
};

// Public.

proto.pop = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    return doc._popMany(args[0]);
  } else if (args.length === 2) {
    return doc._popOne(args[0], args[1]);
  }
};
