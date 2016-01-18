Astro.Type.register({
  class: Date,
  validate(args) {
    Validators.date(args);
  },
  cast(value) {
    return new Date(value);
  },
  raw(value) {
    return value;
  }
});