var EmbedField = Astro.EmbedField;

var EmbedManyField =
Astro.EmbedManyField = function EmbedManyField(definition) {
  EmbedField.apply(this, arguments);
};

EmbedManyField.prototype = Object.create(EmbedField.prototype);
EmbedManyField.prototype.constructor = EmbedManyField;

EmbedManyField.prototype.cast = function(values) {
  var self = this;

  if (_.isUndefined(values) || _.isNull(values)) {
    return values;
  }

  var Class = self.getClass();
  var type = self.getType();

  if (_.isArray(values)) {
    if (Class) {
      _.each(values, function(value, index) {
        if (value instanceof Class) {
          values[index] = value;
        } else {
          values[index] = new Class(value);
        }
      });
    } else if (type) {
      _.each(values, function(value, index) {
        values[index] = type.cast(value);
      });
    }
  } else {
    if (Class) {
      if (!(values instanceof Class)) {
        values = new Class(values);
      }
    } else if (type) {
      values = type.cast(values);
    }
  }

  return values;
};

EmbedManyField.prototype.plain = function(values) {
  var self = this;

  if (_.isUndefined(values) || _.isNull(values)) {
    return values;
  }

  var Class = self.getClass();
  var type = self.getType();

  if (_.isArray(values)) {
    if (Class) {
      _.each(values, function(value, index) {
        if (value instanceof Class) {
          values[index] = value._getAll({
            cast: false
          });
        } else {
          values[index] = value.valueOf();
        }
      });
    } else if (type) {
      _.each(values, function(value, index) {
        values[index] = type.plain(value);
      });
    }
  } else {
    if (Class) {
      if (values instanceof Class) {
        values = values._getAll({
          cast: false
        });
      }
    } else if (type) {
      values = type.plain(values);
    }
  }

  return values;
};
