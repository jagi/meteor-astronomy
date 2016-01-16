Validators.maxLength = function(doc, name, param) {
  let value = doc.get(name);

  if (value.length > param) {
    let message = `Length of "${name}" has to be at most ${param}`;
    throw new ValidationError([{
      name,
      type: 'maxLength',
      details: { value, param, message }
    }], message);
  }
};