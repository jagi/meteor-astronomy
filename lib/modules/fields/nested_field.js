var BaseField = Astro.BaseField;
var NestedField = Astro.NestedField = function NestedField(definition) {
  BaseField.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

Astro.utils.class.inherits(NestedField, BaseField);

NestedField.prototype.getClass = function() {
  if (this.class) {
    return Astro.classes[this.class];
  }
};
