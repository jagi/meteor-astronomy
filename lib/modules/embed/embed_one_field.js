var Field = Astro.Field;

var EmbedOneField =
Astro.EmbedOneField = function EmbedOneField(definition) {
  Field.apply(this, arguments);

  this.class = _.isUndefined(definition.class) ? null : definition.class;
};

EmbedOneField.prototype = Object.create(Astro.Field.prototype);
EmbedOneField.prototype.constructor = EmbedOneField;

EmbedOneField.prototype.getDefault = function() {
  var self = this;

  if (self.default) {
    return Field.prototype.getDefault.apply(self, arguments);
  } else if (!_.isUndefined(self.default)) {
    return self.default;
  }

  return {};
};

EmbedOneField.prototype.cast = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  if (self.class) {
    var Class = Astro.classes[self.class];
    if (!Class) {
      throw new Error('The "' + self.class + '" class does not exist');
    }
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
      value = Astro.utils.fields.getAllValues(value, {
        cast: false,
        default: false
      });
    } else {
      value = value.valueOf();
    }
  } else {
    value = value.valueOf();
  }

  return value;
};
