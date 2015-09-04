var proto = Astro.BaseClass.prototype;

// Overloaded functions.

proto._incOne = function(fieldName, incAmount, options) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Cast the "incAmount" argument to a number.
  incAmount = Number(incAmount);

  // Don't allow setting non number value.
  if (_.isNaN(incAmount)) {
    return;
  }

  // Trigger the "beforeInc" event handlers.
  event = new Astro.Event('beforeInc', {
    fieldName: fieldName,
    incAmount: incAmount
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

  Astro.utils.fields.traverseNestedDocs(
    doc,
    fieldName,
    function(nestedDoc, nestedFieldName, Class, field, index) {
      // If we try to increment non number value, then we stop execution.
      if (!_.isNumber(nestedDoc[nestedFieldName])) {
        return;
      }

      if (Class && !field) {
        Astro.errors.warn(
          'fields.not_defined_field',
          nestedFieldName,
          Class.getName()
        );
      }

      // Increment a value of the field by a given amount.
      nestedDoc[nestedFieldName] += incAmount;

      // Add modifier.
      if (options.modifier) {
        if (nestedDoc instanceof Astro.BaseClass) {
          nestedDoc._addModifier('$inc', nestedFieldName, incAmount);
        } else {
          doc._addModifier('$inc', fieldName, incAmount);
        }
      }
    }
  );

  // Trigger the "afterInc" event handlers.
  event = new Astro.Event('afterInc', {
    fieldName: fieldName,
    incAmount: incAmount
  });
  event.target = doc;
  Class.emitEvent(event);
};

proto._incMany = function(fieldsValues, options) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(incAmount, fieldName) {
    doc._incOne(fieldName, incAmount, options);
  });
};

// Public.

proto.inc = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    doc._incMany(args[0]);
  } else if (args.length === 2) {
    doc._incOne(args[0], args[1]);
  }
};
