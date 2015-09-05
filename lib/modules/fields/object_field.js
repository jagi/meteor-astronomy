var ObjectField = Astro.fields.object = function ObjectField() {
  Astro.NestedField.apply(this, arguments);
};

Astro.utils.class.inherits(ObjectField, Astro.NestedField);

ObjectField.prototype.cast = function(value) {
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

ObjectField.prototype.plain = function(value) {
  var self = this;

  if (_.isUndefined(value) || _.isNull(value)) {
    return value;
  }

  var Class = self.getClass();
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
