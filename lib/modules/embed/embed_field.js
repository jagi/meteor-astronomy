var Field = Astro.Field;

var EmbedField = Astro.EmbedField = function EmbedField(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedField.prototype = Object.create(Astro.Field.prototype);
EmbedField.prototype.constructor = EmbedField;

EmbedField.prototype.getClass = function() {
  var self = this;

  if (self.class) {
    return Astro.classes[self.class];
  }
};
