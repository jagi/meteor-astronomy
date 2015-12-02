Astro.createType({
  name: 'object',
  constructor: function ObjectField(definition) {
    Astro.BaseField.apply(this, arguments);

    this.class = null;

    if (_.isString(definition.nested)) {
      var Class = Astro.getClass(definition.nested);
      if (!Class) {
        throw new Error('The nested class for [' + definition.name + '] does not exist');
      }
      this.class = Class;
      return;
    } else if (_.isObject(definition.nested)) {
      this.class = Astro.Class(definition.nested);
      return;
    }
  },
  getDefault: function(def) {
    if (!_.isObject(def)) {
      def = Object(def);
    }

    return this.cast(def);
  },
  cast: function(value) {
    var Class = this.class;

    if (Class) {
      if (!(value instanceof Class)) {
        value = new Class(value);
      } else {
        value = EJSON.clone(value);
      }
    } else {
      if (_.isObject(value)) {
        value = EJSON.clone(value);
      } else {
        value = new Object(value);
      }
    }

    return value;
  },
  plain: function(value) {
    var Class = this.class;

    if (Class) {
      if (value instanceof Class) {
        value = value.raw();
      } else {
        value = EJSON.clone(value.valueOf());
      }
    } else {
      value = EJSON.clone(value.valueOf());
    }

    return value;
  }
});
