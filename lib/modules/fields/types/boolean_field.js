var BaseField = Astro.BaseField;
var BooleanField = Astro.fields.boolean = function BooleanField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(BooleanField, BaseField);

BooleanField.prototype._needsCast = function(value) {
  return BaseField.prototype._needsCast.apply(this, arguments) &&
    !_.isBoolean(value);
};


BooleanField.prototype._cast = function(value) {
  return Boolean(value);
};
