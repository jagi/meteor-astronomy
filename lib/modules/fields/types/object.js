Astro.Type.register({
  class: Object,
  validate(args) {
    Validators.object(args);
  }
});