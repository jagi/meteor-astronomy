Astro.Type.register({
  class: Number,
  validate(args) {
    Validators.number(args);
  },
  cast(value) {
    return Number(value);
  },
  raw(value) {
    return value.valueOf();
  }
});