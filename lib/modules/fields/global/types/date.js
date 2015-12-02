Astro.Type.create({
  name: 'date',
  check: function(value) {
    return _.isDate(value);
  },
  cast: function(value) {
    return new Date(value);
  },
  raw: function(value) {
    return value;
  }
});