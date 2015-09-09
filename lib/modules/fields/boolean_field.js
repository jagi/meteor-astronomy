var BaseField = Astro.BaseField;
var BooleanField = Astro.fields.boolean = function BooleanField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(BooleanField, BaseField);

BooleanField.prototype.needsCast = function(value) {
  return BaseField.prototype.needsCast.apply(this, arguments) &&
    !_.isBoolean(value);
};


BooleanField.prototype.cast = function(value) {
  return Boolean(value);
};
