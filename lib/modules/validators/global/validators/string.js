Validators.string = function(doc, name) {
  let value = doc.get(name);

  if (!_.isString(value)) {
    let message = `"${name}" has to be a string`;
    throw new ValidationError([{
      name: name,
      type: 'string',
      details: {
        value: value
      }
    }], message);
  }
};