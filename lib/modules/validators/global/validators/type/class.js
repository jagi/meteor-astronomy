Validators.class = function(doc, name, Class) {
  let value = doc.get(name);

  if (!(value instanceof Class)) {
    let className = Class.getName();
    let message = `"${name}" has to be ${className}`;
    throw new ValidationError([{
      name,
      type: 'class',
      details: { value, class: Class, message }
    }], message);
  }
};