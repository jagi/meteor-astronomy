var BaseField = Astro.BaseField;
var BooleanField = Astro.fields.boolean = function BooleanField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(BooleanField, BaseField);

BooleanField.prototype.cast = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.isBoolean(value)) {
    return value;
  }

  return Boolean(value);
};
