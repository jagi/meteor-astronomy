Validators.number = function(doc, name) {
  let value = doc.get(name);

  if (!_.isNumber(value)) {
    let message = `"${name}" has to be a number`;
    throw new ValidationError([{
      name,
      type: 'number',
      details: { value, message }
    }], message);
  }
};