Astro.Validator.create({
  name: 'date',
  isValid({ value }) {
    return _.isDate(value);
  },
  resolveError({ name }) {
    return `"${name}" has to be a date`;
  }
});