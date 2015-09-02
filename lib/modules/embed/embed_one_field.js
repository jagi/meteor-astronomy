var EmbedField = Astro.EmbedField;

var EmbedOneField =
Astro.EmbedOneField = function EmbedOneField(definition) {
  EmbedField.apply(this, arguments);
};

EmbedOneField.prototype = Object.create(EmbedField.prototype);
EmbedOneField.prototype.constructor = EmbedOneField;

EmbedOneField.prototype.cast = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  var Class = self.getClass();
  if (Class) {
    if (!(value instanceof Class)) {
      value = new Class(value);
    }
  } else {
    if (!_.isObject(value)) {
      value = new Object(value);
    }
  }

  return value;
};

EmbedOneField.prototype.plain = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (self.class) {
    var Class = Astro.classes[self.class];
    if (!Class) {
      throw new Error('The "' + self.class + '" class does not exist');
    }
    if (value instanceof Class) {
      value = value._getAll({
        cast: false
      });
    } else {
      value = value.valueOf();
    }
  } else {
    value = value.valueOf();
  }

  return value;
};
