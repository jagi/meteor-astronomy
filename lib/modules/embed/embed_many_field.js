var Field = Astro.Field;

var EmbedManyField = Astro.EmbedManyField = function(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedManyField.prototype = Object.create(Astro.Field.prototype);
EmbedManyField.prototype.constructor = EmbedManyField;

EmbedManyField.prototype.getDefault = function() {
  return [];
};
