Validators.gte = function(doc, name, param) {
  let value = doc.get(name);

  if (value < param) {
    let message = `"${name}" has to be greater than or equal ${param}`;
    throw new ValidationError([{
      name,
      type: 'gte',
      details: { value, param, message }
    }], message);
  }
};