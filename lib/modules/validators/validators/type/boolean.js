Astro.Validator.create({
  name: 'boolean',
  isValid({ value }) {
    return _.isBoolean(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a boolean`;
  }
});