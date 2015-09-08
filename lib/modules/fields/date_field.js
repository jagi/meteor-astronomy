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
  }

  return new Date(value);
};

DateField.prototype.plain = function(value) {
  return value;
};
