var setOne = function(fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;
  var event;

  // Deny changing the "_id" property.
  if (fieldName === '_id' && Astro.utils.fields.getValue(doc, '_id')) {
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

  // Cast the value to the proper type and set it on the document.
  Astro.utils.fields.setValue(doc, fieldName, fieldValue);

  // Trigger the "afterSet" event handlers.
  event = new Astro.Event('afterSet', {
    fieldName: fieldName,
    fieldValue: fieldValue
  });
  event.target = doc;
  Class.emitEvent(event);
};

var setMany = function(fieldsValues) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    setOne.call(doc, fieldName, fieldValue);
  });
};

var getOne = function(fieldName) {
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

  // Get current or default value of a field.
  var value = Astro.utils.fields.getValue(doc, fieldName);

  // Trigger the "afterGet" event handlers.
  event = new Astro.Event('afterGet', {
    fieldName: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  return value;
};

var getMany = function(fieldNames) {
  var doc = this;
  var values = {};

  _.each(fieldNames, function(fieldName) {
    var value = doc.get(fieldName);
    values[fieldName] = value;
  });

  return values;
};

var getAll = function() {
  var doc = this;
  var Class = doc.constructor;

  // Get list of fields and their values.
  return doc.get(Class.getFieldsNames());
};

var pushOne = function(fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;
  var event;

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

  Astro.utils.fields.push(doc, fieldName, fieldValue);

  // Trigger the "afterPush" event handlers.
  event = new Astro.Event('afterPush', {
    fieldName: fieldName,
    fieldValue: fieldValue
  });
  event.target = doc;
  Class.emitEvent(event);
};

var pushArray = function(fieldName, fieldValues) {
  var doc = this;

  _.each(fieldValues, function(fieldValue) {
    pushOne.call(doc, fieldName, fieldValue);
  });
};

var pushMany = function(fieldsValues) {
  var doc = this;

  // Set multiple fields.
  _.each(fieldsValues, function(fieldValue, fieldName) {
    if (_.isArray(fieldValue)) {
      pushArray.call(doc, fieldName, fieldValue);
    } else {
      pushOne.call(doc, fieldName, fieldValue);
    }
  });
};

var methods = {};

methods.set = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 1 && _.isObject(arguments[0])) {
    setMany.call(doc, arguments[0]);
  } else if (arguments.length === 2 && _.isString(arguments[0])) {
    setOne.call(doc, arguments[0], arguments[1]);
  }
};

methods.get = function(/* arguments */) {
  var doc = this;

  if (arguments.length === 0) {
    return getAll.call(doc);
  } else if (arguments.length === 1) {
    if (_.isArray(arguments[0])) {
      return getMany.call(doc, arguments[0]);
    } else if (_.isString(arguments[0])) {
      return getOne.call(doc, arguments[0]);
    }
  }
};

methods.push = function(/* arguments */) {
  var doc = this;
  var args = arguments;

  if (args.length === 1 && _.isObject(args[0])) {
    pushMany.call(doc, args[0]);
  } else if (args.length === 2 && _.isString(args[0])) {
    if (_.isArray(args[1])) {
      pushArray.call(doc, args[0], args[1]);
    } else {
      pushOne.call(doc, args[0], args[1]);
    }
  }
};

methods.getModified = function(old) {
  var doc = this;

  return Astro.utils.fields.getModifiedValues(doc, old);
};

_.extend(Astro.BaseClass.prototype, methods);
