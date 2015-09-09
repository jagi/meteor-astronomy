var BaseField = Astro.BaseField;
var DateField = Astro.fields.date = function DateField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(DateField, BaseField);

DateField.prototype._needsCast = function(value) {
  return BaseField.prototype._needsCast.apply(this, arguments) &&
    !_.isDate(value);
};

DateField.prototype._cast = function(value) {
  return new Date(value);
};

DateField.prototype._plain = function(value) {
  return value;
};
