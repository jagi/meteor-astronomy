function castToClass(args = {}) {
  const {
    Class,
    rawDoc,
    options
  } = args;
  // If the class has a type field, then we have to check if we are
  // casting to some of the nested classes.
  const typeField = Class.getTypeField();
  if (typeField) {
    const ChildClass = Class.get(rawDoc[typeField]);
    if (ChildClass && ChildClass.isChildOf(Class)) {
      return new ChildClass(rawDoc, options);
    }
  }
  return new Class(rawDoc, options);
}

export default castToClass;