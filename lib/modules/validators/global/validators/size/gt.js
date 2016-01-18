Astro.Validator.create({
  name: 'gt',
  isValid({ value, param }) {
    return value > param;
  },
  error({ name, param }) {
    return `"${name}" has to be greater than ${param}`;
  }
});