Astro.Type.register({
  class: Number,
  validate: function(doc, fieldName) {
    Validators.number(doc, fieldName);
  },
  cast: function(value) {
    return Number(value);
  },
  raw: function(value) {
    return value.valueOf();
  }
});