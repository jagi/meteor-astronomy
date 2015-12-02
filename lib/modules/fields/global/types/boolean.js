Astro.Type.create({
  name: 'boolean',
  check: function(value) {
    return _.isBoolean(value);
  },
  cast: function(value) {
    if (_.isString(value) && value.toLowerCase() === 'false' || value === '0') {
      return false;
    } else {
      return Boolean(value);
    }
  },
  raw: function(value) {
    return value.valueOf();
  }
});