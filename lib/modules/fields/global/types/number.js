Astro.Type.create({
  name: 'number',
  check: function(value) {
    return _.isNumber(value);
  },
  cast: function(value) {
    return Number(value);
  },
  raw: function(value) {
    return value.valueOf();
  }
});