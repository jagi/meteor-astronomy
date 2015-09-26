Astro.createType({
  name: 'string',
  constructor: function StringField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return !_.isString(value);
  },
  cast: function(value) {
    return String(value);
  }
});
