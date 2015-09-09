var BaseField = Astro.BaseField;
var NumberField = Astro.fields.number = function NumberField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(NumberField, BaseField);

NumberField.prototype._needsCast = function(value) {
  return BaseField.prototype._needsCast.apply(this, arguments) &&
    !_.isNumber(value);
};

NumberField.prototype._cast = function(value) {
  return Number(value);
};
