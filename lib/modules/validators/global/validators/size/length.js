Validators.length = function(doc, name, param) {
  let value = doc.get(name);

  if (value.length !== param) {
    let message = `Length of "${name}" has to be ${param}`;
    throw new ValidationError([{
      name,
      type: 'length',
      details: { value, param, message }
    }], message);
  }
};