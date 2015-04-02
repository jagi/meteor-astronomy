Astronomy.Utils = {};

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
