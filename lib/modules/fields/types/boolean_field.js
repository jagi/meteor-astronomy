Astro.createType({
  name: 'boolean',
  constructor: function BooleanField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return Astro.BaseField.prototype._needsCast.apply(this, arguments) &&
      !_.isBoolean(value);
  },
  cast: function(value) {
    return Boolean(value);
  }
});
