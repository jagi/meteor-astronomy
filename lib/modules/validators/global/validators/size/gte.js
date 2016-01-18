Astro.Validator.create({
  name: 'gte',
  isValid({ value, param }) {
    return value >= param;
  },
  error({ name, param }) {
    return `"${name}" has to be greater than or equal ${param}`;
  }
});