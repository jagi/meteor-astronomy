var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._popOne = function(fieldName, popItem, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Cast the "popItem" argument to a number.
  popItem = Number(popItem);

  // Don not allow the "popItem" value different than -1 and 1.
  if (popItem !== 1 && popItem !== 1) {
    return;
  }

  // Trigger the "beforeChange" event handlers.
  event = new Astro.Event('beforeChange', {
    fieldName: fieldName,
    popItem: popItem
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Trigger the "beforePop" event handlers.
  event = new Astro.Event('beforePop', {
    fieldName: fieldName,
    popItem: popItem
  });
  event.target = doc;
  Class.emitEvent(event);
  // If an event was prevented from the execution, then we stop here.
  if (event.defaultPrevented) {
    return;
  }

  // Set default options of the function.
  options = _.extend({
    modifier: true
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

      if (Class && !field) {
        Astro.errors.warn(
          'fields.not_defined_field',
          nestedFieldName,
          Class.getName()
        );
        return;
      }

      // Add modifier.
      if (options.modifier) {
        if (nestedDoc instanceof Astro.BaseClass) {
          changed = nestedDoc._addModifier('$pop', nestedFieldName, popItem);
        } else {
          changed = doc._addModifier('$pop', fieldName, popItem);
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
      if (popItem === 1) {
        nestedDoc[nestedFieldName].pop();
      } else {
        nestedDoc[nestedFieldName].unshift();
      }
    }
  );

  // If a value change did not take place, then we stop here and the following
  // events will not be triggered.
  if (!changed) {
    return;
  }

  // Trigger the "afterPop" event handlers.
  event = new Astro.Event('afterPop', {
    fieldName: fieldName,
    popItem: popItem
  });
  event.target = doc;
  Class.emitEvent(event);

  // Trigger the "afterChange" event handlers.
  event = new Astro.Event('afterChange', {
    fieldName: fieldName,
    popItem: popItem
  });
  event.target = doc;
  Class.emitEvent(event);
};

proto._popMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(popItem, fieldName) {
    doc._popOne(fieldName, popItem, options);
  });
};

// Public.

proto.pop = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    doc._popMany(args[0]);
  } else if (args.length === 2) {
    doc._popOne(args[0], args[1]);
  }
};
