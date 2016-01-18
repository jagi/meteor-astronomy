Astro.Type.register({
  class: String,
  validate(args) {
    Validators.string(args);
  },
  cast(value) {
    return String(value);
  },
  raw(value) {
    return value.valueOf();
  }
});