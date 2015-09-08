Astro.fields.object = function ObjectField(definition) {
  Astro.NestedField.apply(this, arguments);

  this.class = null;

  if (_.isString(definition.nested)) {
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

Astro.utils.class.inherits(Astro.fields.object, Astro.NestedField);

Astro.fields.object.prototype.cast = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  var Class = self.class;
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

Astro.fields.object.prototype.plain = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  var Class = self.class;
  if (Class) {
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
