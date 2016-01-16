Validators.gt = function(doc, name, param) {
  let value = doc.get(name);

  if (value <= param) {
    let message = `"${name}" has to be greater than ${param}`;
    throw new ValidationError([{
      name,
      type: 'gt',
      details: { value, param, message }
    }], message);
  }
};