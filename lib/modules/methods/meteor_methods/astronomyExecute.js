import AstroClass from '../../../core/class';

function astronomyExecute(args = {}) {
  const {
    className,
    id,
    rawDoc,
    methodName,
    methodArgs
  } = args;

  const Class = AstroClass.get(className);
  const doc = id ? Class.findOne(id) : new Class(rawDoc, {
    clone: false
  });

  // Get a method from the class. In some cases method may not be present,
  // because it might be defined only on the server.
  const method = Class.getMeteorMethod(methodName);
  if (!method) {
    return;
  }

  return method.apply(doc, methodArgs);
};

export default astronomyExecute;