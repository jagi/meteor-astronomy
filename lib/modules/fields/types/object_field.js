Astro.fields.object = function ObjectField(definition) {
  Astro.BaseField.apply(this, arguments);

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

Astro.utils.class.inherits(Astro.fields.object, Astro.BaseField);

Astro.fields.object.prototype.getDefault = function() {
  var def = this.default;

  if (_.isFunction(def)) {
    def = def();
  } else if (_.isNull(def)) {
    return null;
  }

  if (!_.isObject(def)) {
    def = Object(def);
  }

  return this.cast(def);
};

Astro.fields.object.prototype._cast = function(value) {
  var Class = this.class;

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

Astro.fields.object.prototype._plain = function(value) {
  var Class = this.class;

  if (Class) {
    if (value instanceof Class) {
      value = value._getAll();
    } else {
      value = value.valueOf();
    }
  } else {
    value = value.valueOf();
  }

  return value;
};
