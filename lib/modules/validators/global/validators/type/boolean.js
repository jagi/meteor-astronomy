Validators.boolean = function(doc, name) {
  let value = doc.get(name);

  if (!_.isBoolean(value)) {
    let message = `"${name}" has to be a boolean`;
    throw new ValidationError([{
      name,
      type: 'boolean',
      details: { value, message }
    }], message);
  }
};