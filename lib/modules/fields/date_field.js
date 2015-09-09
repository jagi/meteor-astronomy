var BaseField = Astro.BaseField;
var DateField = Astro.fields.date = function DateField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(DateField, BaseField);

DateField.prototype.needsCast = function(value) {
  return BaseField.prototype.needsCast.apply(this, arguments) &&
    !_.isDate(value);
};

DateField.prototype.cast = function(value) {
  return new Date(value);
};

DateField.prototype.plain = function(value) {
  return value;
};
