Astro.Validator.create({
  name: 'string',
  isValid({ value }) {
    return _.isString(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a string`;
  }
});