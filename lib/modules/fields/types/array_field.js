Astro.createType({
  name: 'array',
  constructor: function ArrayField(definition) {
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
  },
  getDefault: function(def) {
    var self = this;

    if (!_.isArray(def)) {
      def = Array(def);
    }

    // Cast each value of the array.
    _.each(def, function(v, i) {
      def[i] = self.cast(v);
    });

    return def;
  },
  cast: function(values) {
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
  },
  plain: function(values) {
    var Class = this.class;
    var field = this.field;

    if (Class) {
      if (values instanceof Class) {
        values = values.raw();
      }
    } else if (field) {
      values = field.plain(values);
    }

    return values;
  }
});
