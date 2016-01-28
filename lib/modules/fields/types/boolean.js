Astro.Type.register({
  class: Boolean,
  validate(args) {
    Validators.boolean(args);
  }
});