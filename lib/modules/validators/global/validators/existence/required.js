Astro.Validator.create({
  name: 'required',
  isValid({ value }) {
    return value !== null && value !== undefined;
  },
  resolveError({ name }) {
    return `"${name}" is required`;
  }
});