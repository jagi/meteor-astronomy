Astro.createType({
  name: 'date',
  constructor: function DateField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return Astro.BaseField.prototype._needsCast.apply(this, arguments) &&
      !_.isDate(value);
  },
  cast: function(value) {
    return new Date(value);
  },
  plain: function(value) {
    return value;
  }
});
