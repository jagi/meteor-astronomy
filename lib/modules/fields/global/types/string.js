Astro.Type.create({
  name: 'string',
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