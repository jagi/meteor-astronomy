import getChildClass from './getChildClass';

function castToClass(args = {}) {
  const {
    Class,
    rawDoc,
    options
  } = args;
  // If the class has a type field, then we have to check if we are
  // casting to some of the nested classes.
  const ChildClass = getChildClass({
    Class,
    rawDoc
  });
  // Create instance of an original class or some of its childs.
  return new ChildClass(rawDoc, options);
}

export default castToClass;