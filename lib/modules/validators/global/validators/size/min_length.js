Validators.minLength = function(doc, name, param) {
  let value = doc.get(name);

  if (value.length < param) {
    let message = `Length of "${name}" has to be at least ${param}`;
    throw new ValidationError([{
      name,
      type: 'minLength',
      details: { value, param, message }
    }], message);
  }
};