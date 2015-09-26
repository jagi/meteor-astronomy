Astro.createType({
  name: 'boolean',
  constructor: function BooleanField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return !_.isBoolean(value);
  },
  cast: function(value) {
    return Boolean(value);
  }
});
