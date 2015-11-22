var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._pullOne = function(fieldName, pullValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;
  var result = [];

  // Trigger the "beforeChange" event handlers.
  event = new Astro.Event('beforeChange', {
    fieldName: fieldName,
    operation: 'pull'
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return result;
  }

  // Trigger the "beforePull" event handlers.
  event = new Astro.Event('beforePull', {
    fieldName: fieldName,
    pullValue: pullValue
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return result;
  }

  // Set default options of the function.
  options = _.extend({
    cast: true,
    modifier: true,
    mutable: false
  }, options);

  // An indicator for detecting whether a change of a value was necessary.
  var changed = false;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      // If we try to pull an element not from an array, then we stop execution.
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

        if (options.cast) {
          // Try casting the value to the proper type.
          pullValue = field.cast(pullValue);
        }

        // Get a plain value of a field for comparison and a modifier.
        pullValue = field.plain(pullValue);
        if (options.modifier) {
          modifierPulledValue = pullValue;
        }
      } else if (Class) {
        Astro.utils.warn(
          'Trying to pull a value from the "' + nestedFieldName + '" field ' +
          'that does not exist in the "' + Class.getName() + '" class'
        );
        return;
      }

      // Check if a value is present in an array.
      if (!_.find(nestedDoc[nestedFieldName], function(value) {
        if (field) {
          value = field.plain(value);
        }
        return EJSON.equals(value, pullValue);
      })) {
        return;
      }

      // Add modifier.
      if (options.modifier) {
        if (_.isUndefined(modifierPulledValue)) {
          modifierPulledValue = EJSON.clone(pullValue);
        }
        if (nestedDoc instanceof Astro.BaseClass) {
          if (_.isUndefined(index)) {
            changed = nestedDoc._addModifier(
              '$pullAll', nestedFieldName, modifierPulledValue
            );
          } else {
            changed = nestedDoc._addModifier(
              '$pullAll', nestedFieldName + '.' + index, modifierPulledValue
            );
          }
        } else {
          changed = doc._addModifier(
            '$pullAll', fieldName, modifierPulledValue
          );
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

      // Pull a value from an array.
      nestedDoc[nestedFieldName] = _.filter(
        nestedDoc[nestedFieldName],
        function(value) {
          if (field) {
            value = field.plain(value);
          }
          if (EJSON.equals(value, pullValue)) {
            if (field) {
              result.push(field.cast(pullValue));
            } else {
              result.push(pullValue);
            }
            return false;
          } else {
            return true;
          }
        }
      );
    }
  );

  // If a value change did not take place, then we stop here and the following
  // events will not be triggered.
  if (!changed) {
    return result;
  }

  // Trigger the "afterPull" event handlers.
  event = new Astro.Event('afterPull', {
    fieldName: fieldName,
    pullValue: pullValue
  });
  event.target = doc;
  Class.emitEvent(event);

  // Trigger the "afterChange" event handlers.
  event = new Astro.Event('afterChange', {
    fieldName: fieldName,
    operation: 'pull'
  });
  event.target = doc;
  Class.emitEvent(event);

  return result;
};

proto._pullMany = function(pullValues, options) {
  var doc = this;
  var result = {};

  // Pull multiple values.
  _.each(pullValues, function(pullValue, fieldName) {
    result[fieldName] = doc._pullOne(fieldName, pullValue, options);
  });

  return result;
};

// Public.

proto.pull = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    return doc._pullMany(args[0]);
  } else if (args.length === 2) {
    return doc._pullOne(args[0], args[1]);
  }
};
