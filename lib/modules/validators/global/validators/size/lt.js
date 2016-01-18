Astro.Validator.create({
  name: 'lt',
  isValid({ value, param }) {
    return value < param;
  },
  error({ name, param }) {
    return `"${name}" has to be less than ${param}`;
  }
});