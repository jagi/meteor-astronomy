Astro.Type.create({
  name: 'string',
  check: function(value) {
    return _.isString(value);
  },
  cast: function(value) {
    return String(value);
  },
  raw: function(value) {
    return value.valueOf();
  }
});