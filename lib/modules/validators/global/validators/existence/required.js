Validators.required = function(doc, name) {
  let value = doc.get(name);

  if (value === null || value === undefined) {
    let message = `"${name}" is required`;
    throw new ValidationError([{
      name,
      type: 'required',
      details: { value, message }
    }], message);
  }
};