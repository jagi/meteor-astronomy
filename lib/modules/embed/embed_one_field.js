var Field = Astro.Field;

var EmbedOneField = Astro.EmbedOneField = function(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedOneField.prototype = Object.create(Astro.Field.prototype);
EmbedOneField.prototype.constructor = EmbedOneField;

EmbedOneField.prototype.getDefault = function() {
  return null;
};
