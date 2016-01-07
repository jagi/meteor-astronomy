Validators.instanceOf = function(doc, name, Class) {
  let value = doc.get(name);

  if (!(value instanceof Class)) {
    let className = Class.getName();
    let message = `"${name}" has to be an instance of ${className}`;
    throw new ValidationError([{
      name: name,
      type: 'instanceOf',
      details: {
        value: value,
        class: Class
      }
    }], message);
  }
};