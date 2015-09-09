var BaseField = Astro.BaseField;
var StringField = Astro.fields.string = function StringField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(StringField, BaseField);

StringField.prototype.needsCast = function(value) {
  return BaseField.prototype.needsCast.apply(this, arguments) &&
    !_.isString(value);
};

StringField.prototype.cast = function(value) {
  return String(value);
};
