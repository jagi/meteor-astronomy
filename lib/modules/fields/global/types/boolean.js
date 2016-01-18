Astro.Type.register({
  class: Boolean,
  validate(args) {
    Validators.boolean(args);
  },
  cast(value) {
    if (_.isString(value) && value.toLowerCase() === 'false' || value === '0') {
      return false;
    } else {
      return Boolean(value);
    }
  },
  raw(value) {
    return value.valueOf();
  }
});