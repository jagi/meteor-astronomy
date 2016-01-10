Astro.Type.register({
  class: Boolean,
  validate: function(doc, fieldName) {
    Validators.boolean(doc, fieldName);
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