var NestedField = Astro.NestedField;
var ArrayField = Astro.fields.array = function ArrayField(definition) {
  NestedField.apply(this, arguments);

  if (_.isUndefined(definition.nestedType)) {
    this.nestedType = null;
  } else if (_.isString(definition.nestedType)) {
    var Field = Astro.fields[definition.nestedType];
    this.nestedType = new Field();
  }
};

Astro.utils.class.inherits(ArrayField, NestedField);

ArrayField.prototype.getNestedType = function() {
  if (this.nestedType) {
    return this.nestedType;
  }
};

ArrayField.prototype.cast = function(values) {
  var self = this;

  if (_.isUndefined(values) || _.isNull(values)) {
    return values;
  }

  var Class = self.getClass();
  var type = self.getNestedType();

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

ArrayField.prototype.plain = function(values) {
  var self = this;

  if (_.isUndefined(values) || _.isNull(values)) {
    return values;
  }

  var Class = self.getClass();
  var type = self.getNestedType();

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
