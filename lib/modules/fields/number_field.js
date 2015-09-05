var BaseField = Astro.BaseField;
var NumberField = Astro.fields.number = function NumberField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(NumberField, BaseField);

NumberField.prototype.cast = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.isNumber(value)) {
    return value;
  }

  return Number(value);
};
