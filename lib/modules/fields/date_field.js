var BaseField = Astro.BaseField;
var DateField = Astro.fields.date = function DateField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(DateField, BaseField);

DateField.prototype.cast = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.isDate(value)) {
    return value;
  } else if (_.isString(value)) {
    var date = Date.parse(value);
    if (!_.isNaN(date)) {
      return new Date(date);
    } else {
      return null;
    }
  } else if (_.isNumber(value)) {
    return new Date(value);
  }

  return null;
};

DateField.prototype.plain = function(value) {
  return value;
};
