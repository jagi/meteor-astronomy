var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._setOne = function(fieldName, setValue, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;
  var modifierFieldValue;

  // Don't allow setting undefined value.
  if (_.isUndefined(setValue)) {
    return;
  }

  // Trigger the "beforeChange" event handlers.
  event = new Astro.Event('beforeChange', {
    fieldName: fieldName,
    operation: 'set'
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Trigger the "beforeSet" event handlers.
  event = new Astro.Event('beforeSet', {
    fieldName: fieldName,
    setValue: setValue
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
    mutable: false
  }, options);

  // An indicator for detecting whether a change of a value was necessary.
  var changed = false;

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
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

        // We are setting a value of a single nested field.
        if (field instanceof Astro.fields.object) {

          // The value being set has to be an object.
          if (!_.isObject(setValue) && !_.isNull(setValue)) {
            return;
          }
          // Try casting the value to the proper type.
          if (options.cast) {
            setValue = field.cast(setValue);
          }
          // Get a plain value of a field for a modifier.
          if (options.modifier) {
            modifierFieldValue = field.plain(setValue);
          }

        }
        // We are setting a value of many nested fields.
        else if (field instanceof Astro.fields.array) {

          // There are two possiblities. We can try setting entire array or a
          // single array element.
          if (_.isUndefined(index)) {

            // The value being set has to be an array.
            if (!_.isArray(setValue) && !_.isNull(setValue)) {
              return;
            }
            if (options.modifier) {
              modifierFieldValue = [];
            }
            _.each(setValue, function(v, i) {
              // Try casting the value to the proper type.
              if (options.cast) {
                setValue[i] = field.cast(v);
              }
              // Get a plain value of a field for a modifier.
              if (options.modifier) {
                modifierFieldValue[i] = field.plain(v);
              }
            });

          } else {

            // Try casting the value to the proper type.
            if (options.cast) {
              setValue = field.cast(setValue);
            }
            // Get a plain value of a field for a modifier.
            if (options.modifier) {
              modifierFieldValue = field.plain(setValue);
            }

          }

        }
        // We are just setting the value.
        else {

          // Try casting the value to the proper type.
          if (options.cast) {
            setValue = field.cast(setValue);
          }

          // Get a plain value of a field for a modifier.
          if (options.modifier) {
            modifierFieldValue = field.plain(setValue);
          }

        }
      } else if (Class) {
        Astro.utils.warn(
          'Trying to set a value of the "' + nestedFieldName +
          '" field that does not exist in the "' + Class.getName() + '" class'
        );
        return;
      }

      // Add modifier.
      if (options.modifier) {
        if (_.isUndefined(modifierFieldValue)) {
          modifierFieldValue = EJSON.clone(setValue);
        }
        if (nestedDoc instanceof Astro.BaseClass) {
          if (_.isUndefined(index)) {
            changed = nestedDoc._addModifier(
              '$set', nestedFieldName, modifierFieldValue
            );
          } else {
            changed = nestedDoc._addModifier(
              '$set', nestedFieldName + '.' + index, modifierFieldValue
            );
          }
        } else {
          changed = doc._addModifier('$set', fieldName, modifierFieldValue);
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

      // Set the given value on the document but only if the value has changed.
      if (_.isUndefined(index)) {
        if (EJSON.equals(nestedDoc[nestedFieldName], setValue)) {
          return;
        }
        nestedDoc[nestedFieldName] = setValue;
      } else {
        if (EJSON.equals(nestedDoc[nestedFieldName][index], setValue)) {
          return;
        }
        nestedDoc[nestedFieldName][index] = setValue;
      }
    }
  );

  // If a value change did not take place, then we stop here and the following
  // events will not be triggered.
  if (!changed) {
    return;
  }

  // Trigger the "afterSet" event handlers.
  event = new Astro.Event('afterSet', {
    fieldName: fieldName,
    setValue: setValue
  });
  event.target = doc;
  Class.emitEvent(event);

  // Trigger the "afterChange" event handlers.
  event = new Astro.Event('afterChange', {
    fieldName: fieldName,
    operation: 'set'
  });
  event.target = doc;
  Class.emitEvent(event);
};

proto._setMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(setValue, fieldName) {
    doc._setOne(fieldName, setValue, options);
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
