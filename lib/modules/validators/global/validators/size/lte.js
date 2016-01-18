Astro.Validator.create({
  name: 'lte',
  isValid({ value, param }) {
    return value <= param;
  },
  error({ name, param }) {
    return `"${name}" has to be less than or equal ${param}`;
  }
});