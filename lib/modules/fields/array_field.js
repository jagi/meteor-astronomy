Astro.fields.array = function ArrayField(definition) {
  Astro.NestedField.apply(this, arguments);

  this.field = null;
  this.class = null;

  if (_.isString(definition.nested)) {
    var Field = Astro.fields[definition.nested];
    if (Field) {
      this.field = new Field();
      return;
    }

    var Class = Astro.getClass(definition.nested);
    if (Class) {
      this.class = Class;
      return;
    }
  } else if (_.isObject(definition.nested)) {
    this.class = Astro.Class(definition.nested);
    return;
  }
};

Astro.utils.class.inherits(Astro.fields.array, Astro.NestedField);

Astro.fields.array.prototype.cast = function(values) {
  var self = this;

  var Class = self.class;
  var field = self.field;

  if (_.isArray(values)) {
    if (Class) {
      _.each(values, function(value, index) {
        if (value instanceof Class) {
          values[index] = value;
        } else {
          values[index] = new Class(value);
        }
      });
    } else if (field) {
      _.each(values, function(value, index) {
        values[index] = field.cast(value);
      });
    }
  } else {
    if (Class) {
      if (!(values instanceof Class)) {
        values = new Class(values);
      }
    } else if (field) {
      values = field.cast(values);
    }
  }

  return values;
};

Astro.fields.array.prototype.plain = function(values) {
  var self = this;

  if (_.isUndefined(values) || _.isNull(values)) {
    return values;
  }

  var Class = self.class;
  var field = self.field;

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
    } else if (field) {
      _.each(values, function(value, index) {
        values[index] = field.needsPlain(value) ? field.plain(value) : value;
      });
    }
  } else {
    if (Class) {
      if (values instanceof Class) {
        values = values._getAll({
          cast: false
        });
      }
    } else if (field) {
      values = field.needsPlain(values) ? field.plain(values) : values;
    }
  }

  return values;
};
