Astro.Type.register({
  class: String,
  validate: function(doc, fieldName) {
    Validators.string(doc, fieldName);
  },
  cast: function(value) {
    return String(value);
  },
  raw: function(value) {
    return value.valueOf();
  }
});