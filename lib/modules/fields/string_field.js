var BaseField = Astro.BaseField;
var StringField = Astro.fields.string = function StringField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(StringField, BaseField);

StringField.prototype.cast = function(value) {
  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (_.isString(value)) {
    return value;
  }

  return String(value);
};
