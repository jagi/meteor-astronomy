Validators.lt = function(doc, name, param) {
  let value = doc.get(name);

  if (value >= param) {
    let message = `"${name}" has to be less than ${param}`;
    throw new ValidationError([{
      name,
      type: 'lt',
      details: { value, param, message }
    }], message);
  }
};