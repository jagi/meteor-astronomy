var BaseField = Astro.BaseField;
var NullField = Astro.fields.null = function NullField() {
  BaseField.apply(this, arguments);
};

Astro.utils.class.inherits(NullField, BaseField);
