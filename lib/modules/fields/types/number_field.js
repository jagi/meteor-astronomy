Astro.createType({
  name: 'number',
  constructor: function NumberField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return Astro.BaseField.prototype._needsCast.apply(this, arguments) &&
      !_.isNumber(value);
  },
  cast: function(value) {
    return Number(value);
  }
});
