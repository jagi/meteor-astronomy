Validators.maxLength = function(doc, name, maxLength) {
  let value = doc.get(name);

  if (value.length > maxLength) {
    let message = `Length of "${name}" has to be at most ${maxLength}`;
    throw new ValidationError([{
      name: name,
      type: 'maxLength',
      details: {
        value: value,
        maxLength: maxLength
      }
    }], message);
  }
};