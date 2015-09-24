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
  } else {
    var Field = Astro.fields.null;
    if (Field) {
      this.field = new Field();
    }
  }
};

Astro.utils.class.inherits(Astro.fields.array, Astro.BaseField);

Astro.fields.array.prototype.getDefault = function() {
  var self = this;
  var def;

  if (_.isFunction(self.default)) {
    def = self.default();
  } else if (_.isNull(self.default)) {
    return null;
  } else {
    def = self.default;
  }

  if (!_.isArray(def)) {
    def = Array(def);
  }

  // Cast each value of the array.
  _.each(def, function(v, i) {
    def[i] = self.cast(v);
  });

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
