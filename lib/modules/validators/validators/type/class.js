Astro.Validator.create({
  name: 'class',
  parseParam(param) {
    if (!Astro.Class.contains(param)) {
      throw new TypeError(
        `Parameter for the "class" validator has to be an Astronomy class`
      );
    }
  },
  isValid({ value, param: Class }) {
    return value instanceof Class;
  },
  resolveError({ name, param: Class }) {
    let className = Class.getName();
    return `"${name}" has to be ${className}`;
  }
});