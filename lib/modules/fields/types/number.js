Astro.Type.register({
  class: Number,
  validate(args) {
    Validators.number(args);
  }
});