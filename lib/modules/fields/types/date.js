Astro.Type.register({
  class: Date,
  validate(args) {
    Validators.date(args);
  }
});