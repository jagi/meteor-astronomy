Astro.createType({
  name: 'number',
  constructor: function NumberField() {
    Astro.BaseField.apply(this, arguments);
  },
  needsCast: function(value) {
    return !_.isNumber(value);
  },
  cast: function(value) {
    if (_.isString(value)) {
      if (value === '') {
        return null;
      }
      if (!/^[\d\-\.]+$/.test(value)) {
        return NaN;
      }
    }
    return Number(value);
  }
});
