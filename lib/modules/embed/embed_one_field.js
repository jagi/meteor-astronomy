var Field = Astro.Field;

var EmbedOneField =
Astro.EmbedOneField = function EmbedOneField(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedOneField.prototype = Object.create(Astro.Field.prototype);
EmbedOneField.prototype.constructor = EmbedOneField;

EmbedOneField.prototype.getDefault = function() {
  return null;
};

EmbedOneField.prototype.cast = function(value) {
  var self = this;

  if (self.class) {
    var Class = Astro.classes[self.class];
    return new Class(value);
  } else {
    if (_.isObject(value)) {
      return value;
    }
    return new Object(value);
  }
};
