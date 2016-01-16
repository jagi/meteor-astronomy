Validators.lte = function(doc, name, param) {
  let value = doc.get(name);

  if (value > param) {
    let message = `"${name}" has to be less than or equal ${param}`;
    throw new ValidationError([{
      name,
      type: 'lte',
      details: { value, param, message }
    }], message);
  }
};