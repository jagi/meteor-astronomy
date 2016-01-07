Validators.required = function(doc, name) {
  let value = doc.get(name);

  if (value === null) {
    let message = `"${name}" is required`;
    throw new ValidationError([{
      name: name,
      type: 'required',
      details: {
        value: value
      }
    }], message);
  }
};