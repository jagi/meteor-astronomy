Astronomy.Utils = {};

Astronomy.Utils.transform = function(className) {
  return function(doc) {
    var transformClassName = className;
    // If there is `_type` attribute in the document, then look for class with
    // name equal to this attribute value. The `_type` attribute is the name
    // of the child class. Stored document is instance of this class.
    if (doc._type && _.has(Classes, doc._type)) {
      // Child class exists, so we will use this class for creating instance.
      transformClassName = doc._type;
    }
    // If document has `_type` attribute and we haven't found class for that
    // name we will use parent class name stored in the `transformClassName` param.

    // Get class from classes list, create instance and return.
    var Class = Classes[transformClassName];
    if (Class) {
      return new Class(doc);
    }

    // Return plain object, if class does have not been defined.
    return doc;
  };
};

Astronomy.Utils.addFieldType = function(type, convertFunction) {
  if (!_.isFunction(type) || !_.isFunction(convertFunction)) {
    return;
  }

  Astronomy._fieldTypes[type] = convertFunction;
};

var defaultConvertFieldValueByType = function(value) {
  return value;
};

Astronomy.Utils.convertFieldValueByType = function(value, type) {
  if (!_.isFunction(type)) {
    return;
  }

  var convert;
  if (_.has(Astronomy._fieldTypes, type)) {
    convert = Astronomy._fieldTypes[type];
  } else {
    convert = defaultConvertFieldValueByType;
  }

  return convert(value);
};

Astronomy.Utils.addFieldType(String, function(value) {
  return String(value);
});

Astronomy.Utils.addFieldType(Number, function(value) {
  return Number(value);
});

Astronomy.Utils.addFieldType(Boolean, function(value) {
  return Boolean(value);
});

Astronomy.Utils.addFieldType(Object, function(value) {
  return Object(value);
});

Astronomy.Utils.addFieldType(Array, function(value) {
  return value;
});

Astronomy.Utils.addFieldType(Date, function(value) {
  if (_.isString(value)) {
    var date = Date.parse(value);
    if (!_.isNaN(date)) {
      return new Date(date);
    }
  } else if (_.isNumber(value)) {
    return new Date(value);
  } else {
    return value;
  }
});
