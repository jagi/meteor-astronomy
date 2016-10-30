import config from '../../../core/config';

function getChildClass(args = {}) {
  const {
    Class,
    rawDoc
  } = args;

  const typeField = Class.getTypeField();
  // If a class does not have a type field, then we just return an original
  // class.
  if (!typeField) {
    return Class;
  }
  // If a class has a type field, then we have to check if a raw document
  // contains information about child class type.
  const ChildClass = Class.get(rawDoc[typeField]);
  // Return a child class if it exists and in fact it's a child of an original
  // class.
  if (ChildClass && ChildClass.isChildOf(Class)) {
    return ChildClass;
  }
  // Otherwise just return original class.
  return Class;
}

export default getChildClass;