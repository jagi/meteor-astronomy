var setOne = function(fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;

  // Deny changing the "_id" property.
  if (fieldName === '_id' && Astro.utils.fields.getValue(doc, '_id')) {
    return;
  }

  // Trigger the "beforeSet" event handlers for every schema.
  var event = new Astro.Event('beforeSet', {
    field: fieldName,
    value: fieldValue
  });
  event.target = doc;
  doc.constructor.emitEvent(event);

  // If an event was prevented from the execution, then we stop here.
  if (e.defaultPrevented) {
    return;
  }

  // Cast the value to the proper type and set it on the document.
  Astro.utils.fields.setValue(doc, fieldName, fieldValue);

  // Trigger the "afterSet" event handlers for every schema.
  var event = new Astro.Event('afterSet', {
    field: fieldName,
    value: fieldValue
  });
  event.target = doc;
  doc.constructor.emitEvent(event);
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

  // Trigger the "beforeGet" event handlers for every schema.
  var event = new Astro.Event('beforeGet', {
    field: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  // If an event was prevented from the execution, then we stop here.
  if (e.defaultPrevented) {
    return;
  }

  // Get current or default value of a field.
  var value = Astro.utils.fields.getValue(doc, fieldName);

  // Trigger the "afterGet" event handlers for every schema.
  var event = new Astro.Event('afterGet', {
    field: fieldName
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

var methods = {
  set: function(fieldName, fieldValue) {
    var doc = this;

    if (arguments.length === 1 && _.isObject(fieldName)) {
      setMany.call(doc, fieldName);
    } else if (arguments.length === 2 && _.isString(fieldName)) {
      setOne.call(doc, fieldName, fieldValue);
    }
  },

  get: function(fieldName) {
    var doc = this;

    if (arguments.length === 0) {
      return getAll.call(doc);
    } else if (arguments.length === 1) {
      if (_.isArray(fieldName)) {
        return getMany.call(doc, fieldName);
      } else if (_.isString(fieldName)) {
        return getOne.call(doc, fieldName);
      }
    }
  },

  getModified: function(old) {
    var doc = this;

    return Astro.utils.fields.getModifiedValues(doc, old);
  },

  push: function(fieldName, fieldValue) {
    var doc = this;

    return Astro.utils.fields.push(doc, fieldName, fieldValue);
  }
};

_.extend(Astro.BaseClass.prototype, methods);
