var setOne = function(fieldName, fieldValue) {
  var doc = this;
  var Class = doc.constructor;

  // Deny changing the "_id" property.
  if (fieldName === '_id' && Astro.utils.fields.getValue(doc, '_id')) {
    return;
  }

  // Trigger the "beforeset" event handlers for every schema.
  var event = new Astro.Event('beforeset', {
    field: fieldName,
    value: fieldValue
  });
  event.target = doc;
  doc.constructor.emitEvent(event);

  // Cast the value to the proper type and set it on the document.
  Astro.utils.fields.setValue(doc, fieldName, fieldValue);

  // Trigger the "afterset" event handlers for every schema.
  var event = new Astro.Event('afterset', {
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

  // Trigger the "beforeget" event handlers for every schema.
  var event = new Astro.Event('beforeget', {
    field: fieldName
  });
  event.target = doc;
  Class.emitEvent(event);

  // Get current or default field's value.
  var value = Astro.utils.fields.getValue(doc, fieldName);

  // Trigger the "afterget" event handlers for every schema.
  var event = new Astro.Event('afterget', {
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
  return doc.get(Astro.utils.fields.getAllFieldsNames(Class));
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
  }
};

_.extend(Astro.base.Class.prototype, methods);
