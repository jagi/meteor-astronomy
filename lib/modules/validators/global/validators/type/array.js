Validators.array = function(doc, name) {
  let value = doc.get(name);

  if (!_.isArray(value)) {
    let message = `"${name}" has to be an array`;
    throw new ValidationError([{
      name,
      type: 'array',
      details: { value, message }
    }], message);
  }
};