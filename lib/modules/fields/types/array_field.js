Astro.fields.array = function ArrayField(definition) {
  Astro.BaseField.apply(this, arguments);

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

Astro.utils.class.inherits(Astro.fields.array, Astro.BaseField);

Astro.fields.array.prototype.getDefault = function() {
  var def = this.default;

  if (_.isFunction(def)) {
    def = def();
  } else if (_.isNull(def)) {
    return null;
  }

  if (!_.isArray(def)) {
    def = Array(def);
  }

  return def;
};

Astro.fields.array.prototype._cast = function(values) {
  var Class = this.class;
  var field = this.field;

  if (Class) {
    if (!(values instanceof Class)) {
      values = new Class(values);
    }
  } else if (field) {
    values = field.cast(values);
  }

  return values;
};

Astro.fields.array.prototype._plain = function(values) {
  var Class = this.class;
  var field = this.field;

  if (Class) {
    if (values instanceof Class) {
      values = values._getAll();
    }
  } else if (field) {
    values = field.plain(values);
  }

  return values;
};
