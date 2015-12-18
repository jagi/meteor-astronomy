Astro.Type.create({
  name: 'date',
  validate: function(doc, fieldName) {
    Validators.date(doc, fieldName);
  },
  cast: function(value) {
    return new Date(value);
  },
  raw: function(value) {
    return value;
  }
});