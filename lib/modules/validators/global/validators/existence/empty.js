Validators.empty = function(doc, name) {
  let value = doc.get(name);

  if (value !== null && value !== undefined) {
    let message = `"${name}" should be empty`;
    throw new ValidationError([{
      name,
      type: 'empty',
      details: { value, message }
    }], message);
  }
};