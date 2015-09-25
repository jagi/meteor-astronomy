Astro.createType({
  name: 'string',
  constructor: function StringField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return Astro.BaseField.prototype._needsCast.apply(this, arguments) &&
      !_.isString(value);
  },
  cast: function(value) {
    return String(value);
  }
});
