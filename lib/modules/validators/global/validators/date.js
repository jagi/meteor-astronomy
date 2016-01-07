Validators.date = function(doc, name) {
  let value = doc.get(name);

  if (!_.isDate(value)) {
    let message = `"${name}" has to be a date`;
    throw new ValidationError([{
      name: name,
      type: 'date',
      details: {
        value: value
      }
    }], message);
  }
};