Astro.Type.register({
  class: String,
  validate(args) {
    Validators.string(args);
  }
});